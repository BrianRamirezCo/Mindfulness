# Valeria Sarmiento — Plataforma de Mindfulness & Bienestar

Plataforma de e-commerce completa para la venta de libros físicos, ebooks y cursos de mindfulness, con sistema de newsletter, reflexiones y panel de administración.

**Demo:** [mindfulness-pi.vercel.app](https://mindfulness-pi.vercel.app)

---

## Stack Tecnológico

**Frontend**

- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Redux Toolkit
- React Router DOM
- Recharts (gráficos)
- Axios

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT (httpOnly cookies)
- Passport.js (Google OAuth)
- Bcrypt
- Helmet + express-rate-limit

**Servicios externos**

- MongoDB Atlas (base de datos)
- Cloudinary (imágenes)
- MercadoPago (pagos)
- Resend (emails transaccionales)
- Google OAuth 2.0 (autenticación)
- Google Drive (archivos de ebooks)

**Deploy**

- Frontend: Vercel
- Backend: Railway

---

## Arquitectura

```
/
├── client/                   # Frontend React + Vite
│   ├── src/
│   │   ├── assets/           # Imágenes estáticas
│   │   ├── components/
│   │   │   ├── admin-view/   # Componentes del panel admin
│   │   │   ├── auth/         # Componentes de autenticación
│   │   │   ├── common/       # Componentes reutilizables
│   │   │   ├── shopping-view/# Componentes de la tienda
│   │   │   └── ui/           # Componentes base (shadcn)
│   │   ├── lib/              # Utilidades y configuración
│   │   ├── pages/
│   │   │   ├── admin-view/   # Páginas del panel admin
│   │   │   ├── auth/         # Páginas de autenticación
│   │   │   └── shopping-view/# Páginas de la tienda
│   │   └── store/            # Redux slices
│   │       ├── admin/
│   │       ├── common/
│   │       └── shop/
│   └── public/               # Archivos estáticos públicos
│
└── server/                   # Backend Node.js + Express
    ├── config/               # Configuración DB, Passport
    ├── controllers/
    │   ├── admin/            # Controladores del admin
    │   ├── auth/             # Controladores de autenticación
    │   └── shop/             # Controladores de la tienda
    ├── helpers/              # Cloudinary, email
    ├── models/               # Modelos Mongoose
    └── routes/               # Rutas de la API
        ├── admin/
        ├── auth/
        ├── common/
        └── shop/
```

---

## Variables de Entorno

### Backend (`server/.env`)

```env
# Base de datos
MONGODB_URI=mongodb+srv://...

# JWT
JWT_SECRET=tu_jwt_secret
JWT_REFRESH_SECRET=tu_jwt_refresh_secret

# Entorno
NODE_ENV=development
PORT=5000

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# MercadoPago
MP_ACCESS_TOKEN=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Resend (emails)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Ebooks
EBOOK_LINK_EXPIRY=86400
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
```

---

## Instalación y Desarrollo Local

**Requisitos:** Node.js 18+, MongoDB Atlas account

```bash
# Clonar el repositorio
git clone https://github.com/BrianRamirezCo/Mindfulness.git
cd Mindfulness

# Instalar dependencias del backend
cd server
npm install

# Instalar dependencias del frontend
cd ../client
npm install

# Crear archivos .env en server/ y client/ con las variables listadas arriba

# Correr el backend (puerto 5000)
cd server
npm run dev

# Correr el frontend (puerto 5173)
cd client
npm run dev
```

---

## API — Endpoints principales

### Autenticación

| Método | Ruta                        | Descripción                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/auth/register`        | Registro de usuario                  |
| POST   | `/api/auth/login`           | Login con email y contraseña         |
| POST   | `/api/auth/logout`          | Cerrar sesión                        |
| POST   | `/api/auth/verify-email`    | Verificar cuenta con código          |
| POST   | `/api/auth/forgot-password` | Solicitar recuperación de contraseña |
| POST   | `/api/auth/reset-password`  | Restablecer contraseña               |
| POST   | `/api/auth/change-password` | Cambiar contraseña (autenticado)     |
| GET    | `/api/auth/google`          | Iniciar OAuth con Google             |
| GET    | `/api/auth/check-auth`      | Verificar sesión activa              |

### Tienda

| Método | Ruta                                           | Descripción                       |
| ------ | ---------------------------------------------- | --------------------------------- |
| GET    | `/api/shop/products/get`                       | Listar productos con filtros      |
| GET    | `/api/shop/products/get/:id`                   | Detalle de producto               |
| POST   | `/api/shop/cart/add`                           | Agregar al carrito                |
| GET    | `/api/shop/cart/get/:userId`                   | Obtener carrito                   |
| POST   | `/api/shop/order/create`                       | Crear orden y preferencia MP      |
| POST   | `/api/shop/order/capture`                      | Capturar pago confirmado          |
| GET    | `/api/shop/order/download/:orderId/:productId` | Obtener link de descarga de ebook |

### Admin

| Método | Ruta                             | Descripción                |
| ------ | -------------------------------- | -------------------------- |
| GET    | `/api/admin/products/get`        | Listar todos los productos |
| POST   | `/api/admin/products/add`        | Crear producto             |
| PUT    | `/api/admin/products/edit/:id`   | Editar producto            |
| DELETE | `/api/admin/products/delete/:id` | Eliminar producto          |
| GET    | `/api/admin/orders/get`          | Listar todas las órdenes   |
| PUT    | `/api/admin/orders/update/:id`   | Actualizar estado de orden |

### Newsletter y Reflexiones

| Método | Ruta                                 | Descripción                   |
| ------ | ------------------------------------ | ----------------------------- |
| POST   | `/api/reflections/subscribe`         | Suscribirse al newsletter     |
| GET    | `/api/reflections/published`         | Listar reflexiones publicadas |
| POST   | `/api/reflections/admin/create`      | Crear reflexión               |
| PUT    | `/api/reflections/admin/publish/:id` | Publicar y enviar newsletter  |
| POST   | `/api/reflections/comment/:id`       | Agregar comentario            |

---

## Features

### Autenticación

- Registro con verificación de email (código 6 dígitos)
- Login con email/contraseña o Google OAuth
- JWT con httpOnly cookies + refresh token
- Recuperación de contraseña por email
- Cambio de contraseña desde el perfil

### Tienda

- Catálogo con filtros por categoría y tipo
- Búsqueda en tiempo real
- Carrito persistente
- Checkout con MercadoPago
- Soporte para libros físicos y ebooks
- Descarga de ebooks via Google Drive tras el pago
- Historial de pedidos con botón de descarga

### Panel de Administración

- Dashboard con métricas de ventas y gráficos (Recharts)
- Gestión de productos (CRUD) con upload de imágenes a Cloudinary
- Gestión de órdenes con actualización de estado
- Editor de reflexiones con publicación y envío de newsletter
- Subida de banners para el hero

### Newsletter

- Suscripción desde el home o desde la cuenta
- Envío automático por email (Resend) al publicar una reflexión
- Desuscripción desde el email
- Reflexiones públicas con sección de comentarios

### Seguridad

- Helmet.js para headers HTTP seguros
- Rate limiting en endpoints de autenticación (10 req/15min)
- Rate limiting general (100 req/15min)
- Passwords hasheados con bcrypt (salt 12)
- CORS configurado por dominio
- Variables sensibles en variables de entorno

---

## Deploy

### Frontend (Vercel)

1. Conectar repositorio en Vercel
2. Configurar root directory: `client`
3. Agregar variables de entorno
4. Deploy automático en cada push a `main`

### Backend (Railway)

1. Conectar repositorio en Railway
2. Configurar root directory: `server`
3. Agregar todas las variables de entorno
4. Deploy automático en cada push a `main`

---

## Desarrollado por

**Brian Ramírez** — [GitHub](https://github.com/BrianRamirezCo)

---

_Proyecto desarrollado para Valeria Sarmiento — Mindfulness & Bienestar_
