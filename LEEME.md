# 🚀 ReclamoYA — Guía de Despliegue en Vercel

## Archivos del proyecto

```
reclamoya/
├── index.html              ← Página principal
├── gracias.html            ← Página post-pago (genera la IA)
├── vercel.json             ← Configuración de Vercel
├── .env.example            ← Variables de entorno (plantilla)
└── api/
    ├── crear-preferencia.js  ← Backend: crea el pago en MP
    └── webhook-mp.js         ← Backend: recibe confirmaciones de MP
```

---

## PASO 1 — Crear cuentas necesarias

### MercadoPago Developers
1. Ir a https://www.mercadopago.com.ar/developers/panel
2. Crear una aplicación nueva → "ReclamoYA"
3. Ir a **Credenciales de prueba** → copiar:
   - `Public Key` (empieza con TEST-...)
   - `Access Token` (empieza con TEST-...)
4. Cuando estés listo para producción, usar las de **Credenciales de producción**

### Anthropic (IA)
1. Ir a https://console.anthropic.com/settings/keys
2. Crear una API Key nueva
3. Guardarla (solo se muestra una vez)

---

## PASO 2 — Subir a Vercel

### Opción A: Sin instalar nada (recomendada para empezar)
1. Ir a https://vercel.com → crear cuenta con GitHub
2. Click en **"Add New Project"**
3. Subir los archivos arrastrando la carpeta, o conectar tu repositorio GitHub

### Opción B: Con la CLI de Vercel
```bash
npm install -g vercel
cd reclamoya
vercel
```

---

## PASO 3 — Configurar variables de entorno en Vercel

En tu proyecto de Vercel → **Settings → Environment Variables** → agregar:

| Variable | Valor |
|----------|-------|
| `MP_ACCESS_TOKEN` | Tu Access Token de MercadoPago |
| `ANTHROPIC_API_KEY` | Tu API Key de Anthropic |
| `SITE_URL` | https://tudominio.com.ar (o el .vercel.app) |

---

## PASO 4 — Actualizar el código con tus claves

### En `index.html` (línea ~270):
```javascript
const MP_PUBLIC_KEY = "TU_PUBLIC_KEY_DE_MERCADOPAGO";
// Reemplazar con tu Public Key real (TEST-xxx para pruebas)
```

---

## PASO 5 — Conectar dominio propio (opcional)

1. Registrar `reclamoya.com.ar` en NIC Argentina (https://nic.ar)
2. En Vercel → **Settings → Domains** → agregar tu dominio
3. Configurar los DNS según indica Vercel

---

## PASO 6 — Probar el flujo completo

### Modo TEST (sin dinero real):
- Usar las credenciales de **prueba** de MercadoPago
- Tarjeta de prueba: `4509 9535 6623 3704` / vencimiento: 11/25 / CVV: 123
- Usuario test MP: `TESTUSER` (se crea en el panel de MP)

### Checklist antes de ir a producción:
- [ ] Pago de prueba funciona end-to-end
- [ ] La página `gracias.html` genera la respuesta de IA
- [ ] El webhook recibe notificaciones
- [ ] Probaste desde un celular
- [ ] Reemplazaste las credenciales TEST por PRODUCCIÓN

---

## Costos mensuales estimados

| Servicio | Costo |
|----------|-------|
| Vercel (hosting) | Gratis |
| Dominio .com.ar | ~$800/año |
| Anthropic API | ~$5-15 USD/mes |
| MercadoPago | 4,99% por transacción |

---

## Soporte

Ante cualquier duda sobre la integración, consultá:
- Docs MercadoPago: https://www.mercadopago.com.ar/developers/es/docs
- Docs Anthropic: https://docs.anthropic.com
- Docs Vercel: https://vercel.com/docs
