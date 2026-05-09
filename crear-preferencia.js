// api/crear-preferencia.js
// Función serverless de Vercel — crea la preferencia de pago en MercadoPago
// Nunca expone el Access Token al frontend

const PLANES = {
  basico:   { nombre: "ReclamoYA · Plan Básico Express",       precio: 10000 },
  estandar: { nombre: "ReclamoYA · Plan Estándar con Revisión", precio: 25000 },
  premium:  { nombre: "ReclamoYA · Plan Premium Estrategia",    precio: 50000 },
};

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { plan, nombre, email, empresa, tipo, monto } = req.body;

  if (!plan || !PLANES[plan]) {
    return res.status(400).json({ error: "Plan inválido" });
  }

  const planData = PLANES[plan];

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⚠️  REEMPLAZÁ con tu Access Token de MercadoPago (Panel → Credenciales)
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            id: plan,
            title: planData.nombre,
            description: `Reclamo contra ${empresa} · ${tipo}`,
            quantity: 1,
            unit_price: planData.precio,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: nombre,
          email: email || "consulta@reclamoya.com.ar",
        },
        // URLs a las que MP redirige tras el pago
        // ⚠️  REEMPLAZÁ con tu dominio real
        back_urls: {
          success: `${process.env.SITE_URL}/gracias.html`,
          failure: `${process.env.SITE_URL}/error.html`,
          pending: `${process.env.SITE_URL}/pendiente.html`,
        },
        auto_return: "approved",

        // Webhook para recibir notificaciones de pago (opcional pero recomendado)
        notification_url: `${process.env.SITE_URL}/api/webhook-mp`,

        // Referencia externa para identificar el pago en tu sistema
        external_reference: `${plan}-${Date.now()}`,

        // Expiración de la preferencia: 30 minutos
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error MP:", data);
      return res.status(500).json({ error: "Error al crear preferencia de pago" });
    }

    // Devolvemos la URL de pago al frontend
    return res.status(200).json({
      init_point: data.init_point,        // URL producción
      sandbox_init_point: data.sandbox_init_point, // URL pruebas
      preference_id: data.id,
    });

  } catch (err) {
    console.error("Error servidor:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
