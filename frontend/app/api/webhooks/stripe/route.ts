import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { sendTrialEndingEmail, sendPaymentFailedEmail } from '@/lib/email'

// Map Stripe metadata.tier → human label for emails.
function tierLabel(tier: string | undefined): string {
  switch (tier) {
    case 'STUDENT_PREMIUM':            return 'Student Premium'
    case 'RECRUITER_PAY_PER_CONTACT':  return 'Company Subscription'
    case 'RECRUITER_ENTERPRISE':       return 'Company Subscription'
    case 'INSTITUTION_ENTERPRISE':     return 'Institutional Premium'
    default: return 'your subscription'
  }
}


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.warn('Stripe webhook called but STRIPE_SECRET_KEY is not configured')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// Handle successful checkout session
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const tier = session.metadata?.tier
  const type = session.metadata?.type

  // Institutional Premium has its own metadata shape (institutionId, no userId
  // because the buyer is the org, not the person). Branch off before the
  // userId guard.
  if (type === 'institutional_premium' && session.mode === 'subscription') {
    const institutionId = session.metadata?.institutionId
    if (!institutionId) {
      console.error('Missing institutionId in institutional_premium session metadata')
      return
    }

    await prisma.institution.update({
      where: { id: institutionId },
      data: {
        plan: 'PREMIUM',
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        subscriptionStatus: 'TRIALING', // flips to ACTIVE after the trial via subscription.updated
      },
    })

    const purchasedByUserId = session.metadata?.purchasedByUserId
    if (purchasedByUserId) {
      await prisma.analytics.create({
        data: {
          userId: purchasedByUserId,
          eventType: 'SUBSCRIPTION_STARTED',
          eventName: 'institutional_premium_started',
          properties: {
            institutionId,
            plan: session.metadata?.plan ?? null,
            subscriptionId:
              typeof session.subscription === 'string'
                ? session.subscription
                : session.subscription?.id ?? null,
          },
        },
      })
    }
    return
  }

  if (!userId) {
    console.error('Missing userId in session metadata')
    return
  }

  // Handle position listing purchases (one-time payment)
  if (type === 'position_listing' && session.mode === 'payment') {
    const positionListingId = session.metadata?.positionListingId
    if (!positionListingId) {
      console.error('Missing positionListingId in session metadata')
      return
    }

    const now = new Date()
    const listing = await prisma.positionListing.findUnique({
      where: { id: positionListingId },
    })

    if (!listing) {
      console.error('PositionListing not found:', positionListingId)
      return
    }

    const expiresAt = new Date(now.getTime() + listing.durationDays * 24 * 60 * 60 * 1000)

    await prisma.positionListing.update({
      where: { id: positionListingId },
      data: {
        status: 'ACTIVE',
        activatedAt: now,
        expiresAt,
        stripePaymentIntentId: session.payment_intent as string,
        stripeSessionId: session.id,
      },
    })

    // Ensure user tier is at least PAY_PER_CONTACT so they can use contacts
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: 'RECRUITER_PAY_PER_CONTACT',
      },
    })

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'SUBSCRIPTION_STARTED',
        eventName: 'position_listing_purchased',
        properties: {
          positionListingId,
          amount: session.amount_total,
          durationDays: listing.durationDays,
          title: listing.title,
        },
      },
    })
    return
  }

  // Handle contact credit purchases (one-time payment)
  if (type === 'contact_credits' && session.mode === 'payment') {
    const credits = parseInt(session.metadata?.credits || '1', 10)
    const creditsCents = credits * 1000 // 1 credit = 1000 cents = €10

    await prisma.$transaction([
      // Increment contact balance
      prisma.user.update({
        where: { id: userId },
        data: {
          contactBalance: { increment: creditsCents },
          // Ensure tier is at least PAY_PER_CONTACT
          subscriptionTier: 'RECRUITER_PAY_PER_CONTACT',
        },
      }),
      // Create ContactPayment record
      prisma.contactPayment.create({
        data: {
          userId,
          email: session.customer_details?.email || '',
          amount: session.amount_total || creditsCents,
          currency: session.currency || 'eur',
          credits,
          stripeSessionId: session.id,
          stripeCustomerId: session.customer as string,
          stripePaymentIntentId: session.payment_intent as string,
          status: 'SUCCEEDED',
          paidAt: new Date(),
        },
      }),
    ])

    // Track analytics
    await prisma.analytics.create({
      data: {
        userId,
        eventType: 'SUBSCRIPTION_STARTED',
        eventName: 'contact_credits_purchased',
        properties: {
          credits,
          amount: session.amount_total,
        },
      },
    })
    return
  }

  // Handle subscription checkout
  if (!tier) {
    console.error('Missing tier in session metadata')
    return
  }

  // Update user with subscription info
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      subscriptionTier: tier as any,
      subscriptionStatus: 'TRIALING' // Will be updated to ACTIVE after trial
    }
  })

  // Track analytics
  await prisma.analytics.create({
    data: {
      userId,
      eventType: 'SUBSCRIPTION_STARTED',
      eventName: 'subscription_started',
      properties: {
        tier,
        subscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id || null
      }
    }
  })
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Institutional Premium subscriptions don't have a userId — the buyer is
  // the org. checkout.session.completed has already set Institution.plan
  // and the Stripe IDs; here we just record the period and skip user logic.
  if (subscription.metadata?.type === 'institutional_premium') {
    const institutionId = subscription.metadata?.institutionId
    if (institutionId) {
      const subData = subscription as any
      await prisma.institution.update({
        where: { id: institutionId },
        data: {
          subscriptionStatus: subscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
          premiumUntil: subData.current_period_end
            ? new Date(subData.current_period_end * 1000)
            : undefined,
        },
      })
    }
    return
  }

  const userId = subscription.metadata?.userId
  const tier = subscription.metadata?.tier

  if (!userId || !tier) {
    console.error('Missing userId or tier in subscription metadata')
    return
  }

  const price = subscription.items.data[0]?.price
  const interval = price?.recurring?.interval || 'month'
  const amount = price?.unit_amount || 0

  // Create subscription record
  const subData = subscription as any
  await prisma.subscription.create({
    data: {
      userId,
      tier: tier as any,
      status: subscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
      stripeSubscriptionId: subscription.id,
      stripePriceId: price?.id,
      stripeCurrentPeriodEnd: subData.current_period_end
        ? new Date(subData.current_period_end * 1000)
        : undefined,
      amount,
      currency: price?.currency || 'eur',
      interval,
      trialStart: subData.trial_start ? new Date(subData.trial_start * 1000) : null,
      trialEnd: subData.trial_end ? new Date(subData.trial_end * 1000) : null,
      startedAt: new Date(subscription.created * 1000)
    }
  })

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: subscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
      subscriptionTier: tier as any,
      premiumUntil: subData.current_period_end
        ? new Date(subData.current_period_end * 1000)
        : undefined
    }
  })
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const status = mapStripeStatus(subscription.status)
  const subData = subscription as any
  const periodEnd = subData.current_period_end
    ? new Date(subData.current_period_end * 1000)
    : undefined

  // Institutional Premium: route the update to Institution, not User.
  if (subscription.metadata?.type === 'institutional_premium') {
    const institution = await prisma.institution.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    })
    if (!institution) {
      console.error('Could not find institution for subscription:', subscription.id)
      return
    }
    await prisma.institution.update({
      where: { id: institution.id },
      data: { subscriptionStatus: status, premiumUntil: periodEnd },
    })
    return
  }

  // Default: user-owned subscription.
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  })
  if (!user) {
    console.error('Could not find user for subscription:', subscription.id)
    return
  }

  await prisma.user.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { subscriptionStatus: status, premiumUntil: periodEnd },
  })

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id, endedAt: null },
    data: { status, stripeCurrentPeriodEnd: periodEnd },
  })
}

// Handle subscription deleted (canceled)
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Institutional Premium: revert plan to CORE, mark canceled.
  if (subscription.metadata?.type === 'institutional_premium') {
    const institution = await prisma.institution.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    })
    if (institution) {
      await prisma.institution.update({
        where: { id: institution.id },
        data: {
          plan: 'CORE',
          subscriptionStatus: 'CANCELED',
          premiumUntil: null,
        },
      })
      await prisma.analytics.create({
        data: {
          userId: institution.primaryAdminId ?? subscription.metadata?.purchasedByUserId ?? '',
          eventType: 'SUBSCRIPTION_CANCELED',
          eventName: 'institutional_premium_canceled',
          properties: { institutionId: institution.id, subscriptionId: subscription.id },
        },
      }).catch(() => {/* analytics is best-effort */})
    }
    return
  }

  // Default: user-owned subscription.
  await prisma.user.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { subscriptionStatus: 'EXPIRED', subscriptionTier: 'FREE' },
  })

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id, endedAt: null },
    data: { status: 'EXPIRED', endedAt: new Date() },
  })

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (user) {
    await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType: 'SUBSCRIPTION_CANCELED',
        eventName: 'subscription_canceled',
        properties: { subscriptionId: subscription.id },
      },
    })
  }
}

// Handle trial ending soon (3 days before)
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const subData = subscription as any
  const trialEndsAt = subData.trial_end ? new Date(subData.trial_end * 1000) : new Date()
  const manageUrl = `${process.env.NEXT_PUBLIC_URL || ''}/dashboard/subscription`

  // Institutional Premium — recipient is the admin, label is the institution.
  if (subscription.metadata?.type === 'institutional_premium') {
    const institution = await prisma.institution.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      select: { primaryAdminId: true, name: true },
    })
    if (!institution?.primaryAdminId) return
    const admin = await prisma.user.findUnique({
      where: { id: institution.primaryAdminId },
      select: { email: true, firstName: true },
    })
    if (!admin) return
    await sendTrialEndingEmail(
      admin.email,
      admin.firstName || institution.name,
      'Institutional Premium',
      trialEndsAt,
      manageUrl
    ).catch(err => console.error('Trial-ending email failed (institutional):', err))
    return
  }

  // User-owned (student or recruiter) subscription.
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    select: { email: true, firstName: true, subscriptionTier: true },
  })
  if (!user) {
    console.error('Could not find user for subscription:', subscription.id)
    return
  }
  await sendTrialEndingEmail(
    user.email,
    user.firstName || 'there',
    tierLabel(subscription.metadata?.tier ?? user.subscriptionTier),
    trialEndsAt,
    manageUrl
  ).catch(err => console.error('Trial-ending email failed (user):', err))
}

// Handle successful payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const invoiceData = invoice as any
  if (!invoiceData.subscription) return
  if (!stripe) return

  const subscription = await stripe.subscriptions.retrieve(invoiceData.subscription as string)
  const subData = subscription as any
  const periodEnd = subData.current_period_end
    ? new Date(subData.current_period_end * 1000)
    : undefined

  if (subscription.metadata?.type === 'institutional_premium') {
    await prisma.institution.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { subscriptionStatus: 'ACTIVE', premiumUntil: periodEnd },
    })
    return
  }

  await prisma.user.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { subscriptionStatus: 'ACTIVE', premiumUntil: periodEnd },
  })
}

// Handle failed payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData = invoice as any
  if (!invoiceData.subscription) return
  if (!stripe) return

  // Pull the subscription to read metadata and route correctly. The invoice
  // object alone doesn't tell us if the subscription belongs to a User or
  // an Institution.
  const subscription = await stripe.subscriptions.retrieve(invoiceData.subscription as string)

  const amountMajor = (invoice.amount_due ?? 0) / 100
  const currency = invoice.currency ?? 'eur'
  const manageUrl = `${process.env.NEXT_PUBLIC_URL || ''}/dashboard/subscription`

  if (subscription.metadata?.type === 'institutional_premium') {
    await prisma.institution.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { subscriptionStatus: 'PAST_DUE' },
    })
    const institution = await prisma.institution.findFirst({
      where: { stripeSubscriptionId: subscription.id },
      select: { primaryAdminId: true, name: true },
    })
    if (institution?.primaryAdminId) {
      const admin = await prisma.user.findUnique({
        where: { id: institution.primaryAdminId },
        select: { email: true, firstName: true },
      })
      if (admin) {
        await sendPaymentFailedEmail(
          admin.email,
          admin.firstName || institution.name,
          'Institutional Premium',
          amountMajor,
          currency,
          manageUrl
        ).catch(err => console.error('Payment-failed email failed (institutional):', err))
      }
    }
    return
  }

  await prisma.user.update({
    where: { stripeSubscriptionId: subscription.id },
    data: { subscriptionStatus: 'PAST_DUE' },
  })

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    select: { email: true, firstName: true, subscriptionTier: true },
  })
  if (user) {
    await sendPaymentFailedEmail(
      user.email,
      user.firstName || 'there',
      tierLabel(subscription.metadata?.tier ?? user.subscriptionTier),
      amountMajor,
      currency,
      manageUrl
    ).catch(err => console.error('Payment-failed email failed (user):', err))
  }
}

// Map Stripe subscription status to our enum
function mapStripeStatus(stripeStatus: string): 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED' | 'INACTIVE' {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE'
    case 'trialing':
      return 'TRIALING'
    case 'past_due':
      return 'PAST_DUE'
    case 'canceled':
      return 'CANCELED'
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
      return 'EXPIRED'
    default:
      return 'INACTIVE'
  }
}
