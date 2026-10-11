import { NextResponse } from "next/server";
import { buildOrderSummary, getOrderPricing, validateOrder } from "@/lib/order";
import { pendingCharges } from "@/lib/pricing";

/** Identificador enviado por el formulario para detectar duplicados en el destino. */
function readRequestId(body: unknown) {
  const value = body && typeof body === "object" ? (body as { requestId?: unknown }).requestId : undefined;
  return typeof value === "string" && /^[\w-]{6,64}$/.test(value) ? value : crypto.randomUUID();
}

/**
 * Recibe las solicitudes del formulario y las reenvía al webhook configurado
 * en ORDER_WEBHOOK_URL (Formspree, Make, Zapier, n8n, Slack, Discord...).
 * Si no hay webhook configurado, responde 503 y el formulario lo indica con
 * honestidad en lugar de simular un envío.
 */
export async function POST(request: Request) {
  const webhook = process.env.ORDER_WEBHOOK_URL?.trim();
  if (!webhook) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Campo trampa anti-spam: las personas no lo ven ni lo rellenan.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const result = validateOrder(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: "validation", errors: result.errors }, { status: 422 });
  }

  const summary = buildOrderSummary(result.data);
  // El precio se recalcula aquí: nunca se confía en importes enviados por el navegador.
  const pricing = getOrderPricing(result.data.product, result.data.quantity);

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...result.data,
        requestId: readRequestId(body),
        unitPrice: pricing?.unitPrice ?? null,
        subtotal: pricing?.subtotal ?? null,
        currency: "EUR",
        pendingCharges,
        _subject: `Nueva solicitud de tarjetas NFC · ${result.data.business}`,
        _replyto: result.data.email,
        // "text" y "content" permiten usar directamente webhooks de Slack y Discord.
        text: summary,
        content: summary,
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("[pedido] El webhook respondió con estado", response.status);
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
  } catch (error) {
    console.error("[pedido] No se pudo contactar con el webhook", error);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
