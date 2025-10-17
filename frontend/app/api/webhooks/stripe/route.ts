import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
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

  if (!userId || !tier) {
    console.error('Missing userId or tier in session metadata')
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
  await prisma.subscription.create({
    data: {
      userId,
      tier: tier as any,
      status: subscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
      stripeSubscriptionId: subscription.id,
      stripePriceId: price?.id,
      stripeCurrentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined,
      amount,
      currency: price?.currency || 'eur',
      interval,
      trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
      trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      startedAt: new Date(subscription.created * 1000)
    }
  })

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: subscription.status === 'trialing' ? 'TRIALING' : 'ACTIVE',
      subscriptionTier: tier as any,
      premiumUntil: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined
    }
  })
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    // Try to find user by Stripe subscription ID
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    })

    if (!user) {
      console.error('Could not find user for subscription:', subscription.id)
      return
    }
  }

  const status = mapStripeStatus(subscription.status)

  // Update user
  await prisma.user.update({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      subscriptionStatus: status,
      premiumUntil: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined
    }
  })

  // Update subscription record
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
      endedAt: null
    },
    data: {
      status,
      stripeCurrentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined
    }
  })
}

// Handle subscription deleted (canceled)
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Update user
  await prisma.user.update({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      subscriptionStatus: 'EXPIRED',
      subscriptionTier: 'FREE'
    }
  })

  // End subscription record
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
      endedAt: null
    },
    data: {
      status: 'EXPIRED',
      endedAt: new Date()
    }
  })

  // Track analytics
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  })

  if (user) {
    await prisma.analytics.create({
      data: {
        userId: user.id,
        eventType: 'SUBSCRIPTION_CANCELED',
        eventName: 'subscription_canceled',
        properties: {
          subscriptionId: subscription.id
        }
      }
    })
  }
}

// Handle trial ending soon (3 days before)
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  })

  if (!user) {
    console.error('Could not find user for subscription:', subscription.id)
    return
  }

  // TODO: Send email notification about trial ending
  console.log(`Trial will end for user ${user.email} on ${new Date(subscription.trial_end! * 1000)}`)
}

// Handle successful payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

  await prisma.user.update({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      subscriptionStatus: 'ACTIVE',
      premiumUntil: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : undefined
    }
  })
}

// Handle failed payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  await prisma.user.update({
    where: {
      stripeSubscriptionId: invoice.subscription as string
    },
    data: {
      subscriptionStatus: 'PAST_DUE'
    }
  })

  // TODO: Send email notification about failed payment
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
