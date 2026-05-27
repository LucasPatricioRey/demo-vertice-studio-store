# Vértice Studio - demo full stack ecommerce premium

Demo creada para vender una tienda online inicial profesional para marcas de indumentaria, streetwear, showroom o emprendimientos que hoy venden por Instagram y WhatsApp.

**Idea comercial:** tienda inicial con catálogo editable, panel admin, stock por variantes y pedidos guardados antes de cerrar la venta por WhatsApp.

Demo creada por Lucas Rey.

## Stack

- Monorepo con `/frontend` y `/backend`
- Frontend: Vite, React, TypeScript, React Router, lucide-react, CSS custom responsive
- Backend: Node.js, Express, TypeScript, MongoDB Atlas, Mongoose, JWT, bcrypt, dotenv, cors, morgan, zod
- Cierre de compra: WhatsApp, sin Mercado Pago
- Imágenes actuales: placeholders premium controlados con `vs-gradient://`

## Estructura

```txt
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── validators
│   │   ├── app.ts
│   │   ├── seed.ts
│   │   └── server.ts
│   └── .env.example
├── frontend
│   └── src
│       ├── components
│       ├── data
│       ├── pages
│       ├── api.ts
│       ├── store.tsx
│       └── styles.css
└── docs
    ├── image-plan.md
    └── sales-notes.md
```

## Variables de entorno

Crear `backend/.env` usando:

```env
PORT=4000
MONGODB_URI=
JWT_SECRET=
ADMIN_EMAIL=admin@demo.com
ADMIN_PASSWORD=Admin1234!
FRONTEND_URL=http://localhost:5173
WHATSAPP_NUMBER=5491154097209
```

No se debe commitear `.env`.

## Cómo correr

```bash
npm install
npm run seed
npm run dev
```

URLs locales:

- Frontend: `http://localhost:5173`
- Backend healthcheck: `http://localhost:4000/api/health`
- Admin: `http://localhost:5173/admin/login`

## Scripts

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
npm run lint
npm run seed
npm run check
```

## Credenciales admin demo

- Email: `admin@demo.com`
- Password: `Admin1234!`

El seed crea o actualiza el admin usando `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Cómo probar un pedido por WhatsApp

1. Entrar al catálogo público.
2. Abrir un producto y elegir talle/color con stock.
3. Agregarlo al carrito.
4. Completar nombre, teléfono, barrio/localidad, dirección si aplica, modalidad y observaciones.
5. Presionar **Enviar pedido por WhatsApp**.

Resultado esperado:

- El pedido se guarda en MongoDB si el backend está disponible.
- El pedido aparece en el panel admin, sección Pedidos.
- Se abre WhatsApp con el resumen del pedido, productos, talle, color, cantidad, subtotal y datos del cliente.
- Si el backend falla, la UX no se rompe y WhatsApp se abre igual como fallback.

## Funcionalidades públicas

- Hero editorial de marca streetwear premium
- Catálogo consumido desde API cuando MongoDB está configurado
- Fallback visual local si el backend no tiene DB, para poder mostrar la demo sin romper UX
- Filtros por categoría, talle, color, precio y estado comercial
- Búsqueda y ordenamiento
- Cards con badges: nuevo, drop, destacado, sin stock
- Detalle de producto con talle, color, stock y cantidad
- Carrito persistido en localStorage
- Wishlist persistida en localStorage
- Formulario de pedido con modalidad de entrega
- Guardado de pedido/lead en backend
- Apertura de WhatsApp con mensaje profesional prellenado
- Fallback a WhatsApp si falla el guardado backend
- Secciones de drop, cómo comprar, envíos, showroom, guía de talles, cambios, testimonios, FAQ y CTA final

## Funcionalidades admin

- Login JWT para admin
- Dashboard con métricas
- Productos totales, activos, sin stock y destacados
- Pedidos nuevos, totales y potencial vendido
- Productos con bajo stock
- Crear producto
- Editar producto
- Desactivar producto
- Flags: destacado, nuevo ingreso, drop limitado, activo
- Variantes por talle, color, hex, stock y SKU
- Ver pedidos/consultas
- Cambiar estado: nuevo, contactado, vendido, cancelado

## Qué está simulado

- Marca ficticia: Vértice Studio
- Showroom ficticio en Palermo, CABA
- Instagram ficticio
- Testimonios ficticios
- Ventas/pedidos demo del seed
- Imágenes finales reemplazadas por placeholders premium
- Pago final coordinado por WhatsApp

## Cómo adaptar a un cliente real

1. Reemplazar identidad visual, textos y categorías.
2. Cargar productos reales con imágenes finales.
3. Configurar MongoDB Atlas y variables de entorno.
4. Ajustar mensajes de WhatsApp, zonas de envío y políticas.
5. Publicar frontend/backend en infraestructura elegida.
6. Capacitar al cliente para usar el admin.

## Upgrades posibles

- Cloudinary para carga y gestión de imágenes
- Mercado Pago o checkout online
- Cuentas de cliente
- Historial de compras
- Cupones y descuentos
- Emails automáticos
- Panel admin avanzado con roles
- SEO local y catálogo indexable
- Métricas comerciales
- Mantenimiento mensual, backups y soporte

## Nota

Sitio demostrativo para presentación comercial. Demo creada por Lucas Rey.
