// api/webhook-mp.js
// Recibe notificaciones de MercadoPago cuando se aprueba/rechaza un pago
// Útil para disparar el envío de la carta por email automáticamente

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { type, data } = req.body;

  // MercadoPago envía type: "payment" cuando hay un pago
  if (type === "payment") {
    const paymentId = data?.id;

    try {
      // Consultamos el detalle del pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });

      const payment = await response.json();

      if (payment.status === "approved") {
        // ✅ Pago aprobado
        // Aquí podés:
        // 1. Guardar en base de datos (Supabase, PlanetScale, etc.)
        // 2. Enviar email con la carta (SendGrid, Resend, etc.)
        // 3. Notificar al abogado si es plan Estándar/Premium
        console.log("Pago aprobado:", {
          id: payment.id,
          monto: payment.transaction_amount,
          referencia: payment.external_reference,
          email: payment.payer?.email,
        });
      }

    } catch (err) {
      console.error("Error webhook:", err);
    }
  }

  // MercadoPago espera un 200 para no reintentar
  return res.status(200).end();
}
