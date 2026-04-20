/**
 * Webhook dispatcher — fires platform events to subscribed agent endpoints.
 *
 * Delivery model:
 *   - Each event carries an HMAC-SHA256 signature in X-InTransparency-Signature
 *   - Retries with exponential backoff (via nextRetryAt on WebhookDelivery)
 *   - Delivery log persisted so receivers can audit
 *
 * Events supported:
 *   match.created        — a MatchExplanation was persisted with this subject
 *   credential.issued    — a VerifiableCredential was issued
 *   credential.revoked   — a VerifiableCredential was revoked
 *   stage.completed      — a StageExperience transitioned to EVALUATED
 *   exchange.completed   — an ExchangeEnrollment was marked COMPLETED by host
 */

import prisma from './prisma'
import crypto from 'crypto'
import type { Prisma } from '@prisma/client'

export type WebhookEventType =
  | 'match.created'
  | 'credential.issued'
  | 'credential.revoked'
  | 'stage.completed'
  | 'exchange.completed'

interface DispatchParams {
  eventType: WebhookEventType
  /** Stable event identifier for idempotency on the receiver side */
  eventId: string
  /** Filter subscriptions to those owned by a specific user (default: dispatch to everyone subscribed) */
  ownerIdFilter?: string
  payload: Record<string, unknown>
}

function signPayload(secret: string, bodyJson: string): string {
  return crypto.createHmac('sha256', secret).update(bodyJson).digest('hex')
}

/**
 * Queue deliveries for all matching subscriptions. Fire-and-forget; errors
 * are logged but never thrown into the caller's hot path.
 */
export async function dispatchWebhook(params: DispatchParams): Promise<void> {
  try {
    const where: Prisma.WebhookSubscriptionWhereInput = {
      active: true,
      events: { has: params.eventType },
    }
    if (params.ownerIdFilter) where.ownerId = params.ownerIdFilter

    const subscriptions = await prisma.webhookSubscription.findMany({ where })
    if (subscriptions.length === 0) return

    const bodyJson = JSON.stringify({
      event: params.eventType,
      eventId: params.eventId,
      occurredAt: new Date().toISOString(),
      data: params.payload,
    })

    await Promise.all(
      subscriptions.map(async sub => {
        const delivery = await prisma.webhookDelivery.create({
          data: {
            subscriptionId: sub.id,
            eventType: params.eventType,
            eventId: params.eventId,
            payload: JSON.parse(bodyJson),
            attemptCount: 0,
          },
        })
        await attemptDelivery(sub, delivery.id, bodyJson)
      })
    )
  } catch (err) {
    console.error('[webhooks] dispatch error', err)
  }
}

async function attemptDelivery(
  sub: { id: string; url: string; secret: string },
  deliveryId: string,
  bodyJson: string
): Promise<void> {
  const signature = signPayload(sub.secret, bodyJson)
  let responseStatus: number | null = null
  let responseBody: string | null = null
  let deliveredAt: Date | null = null
  let lastError: string | null = null
  let nextRetryAt: Date | null = null

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(sub.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'InTransparency-Webhook/1.0',
        'X-InTransparency-Signature': `sha256=${signature}`,
        'X-InTransparency-Delivery': deliveryId,
      },
      body: bodyJson,
      signal: controller.signal,
    })
    clearTimeout(timer)
    responseStatus = res.status
    responseBody = (await res.text().catch(() => '')).slice(0, 1000)
    if (res.ok) {
      deliveredAt = new Date()
    } else {
      lastError = `HTTP ${res.status}`
      nextRetryAt = new Date(Date.now() + 60 * 1000) // 1 min
    }
  } catch (err) {
    lastError = err instanceof Error ? err.message : String(err)
    nextRetryAt = new Date(Date.now() + 60 * 1000)
  }

  await prisma.webhookDelivery.update({
    where: { id: deliveryId },
    data: {
      attemptCount: { increment: 1 },
      deliveredAt,
      responseStatus,
      responseBody,
      lastError,
      nextRetryAt,
    },
  })

  await prisma.webhookSubscription.update({
    where: { id: sub.id },
    data: {
      lastDeliveryAt: new Date(),
      lastSuccessAt: deliveredAt ?? undefined,
      lastFailureAt: deliveredAt ? undefined : new Date(),
      consecutiveFailures: deliveredAt ? 0 : { increment: 1 },
    },
  })
}
