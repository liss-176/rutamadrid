# RutaMadrid

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**RutaMadrid** es una aplicación web integral diseñada para la planificación, monitorización en tiempo real y optimización de flotas de reparto y logística urbana en Madrid capital.

La interfaz está desarrollada con un diseño limpio, mobile-first y adaptativo (modo claro y oscuro según el sistema), con mapas interactivos basados en OpenStreetMap / Leaflet, cálculo de emisiones CO₂, costes operativos y gestión de distintivos ambientales de la DGT (Zona de Bajas Emisiones).

---

## Puesta en Marcha Rápida

### Requisitos previos
- **Node.js** (versión 18 o superior recomendada)
- **npm** (versión 9 o superior)

### Instalación de dependencias
```bash
npm install
```

### Ejecución en entorno de desarrollo
```bash
npm run dev
```
La aplicación estará disponible de inmediato en tu navegador en `http://localhost:5173/` (o el puerto indicado por Vite).

### Construcción para producción (Build)
```bash
npm run build
```

---

## Stack Tecnológico

- **React 19** + **TypeScript** + **Vite 8**
- **React Router 7**: Enrutamiento declarativo para la navegación fluida entre pantallas.
- **Leaflet & react-leaflet**: Visualización de mapas reales de Madrid (centro: `[40.4168, -3.7038]`), teselas OpenStreetMap, marcadores animados y polilíneas de ruta.
- **Tailwind CSS v4**: Estilizado utility-first con soporte nativo de modo claro y oscuro (`prefers-color-scheme`).
- **Recharts**: Gráficas interactivas de distribución de entregas por zona urbana.
- **Lucide React**: Iconografía vectorial moderna para transporte, alertas y navegación.
- **Context API**: Gestión centralizada y reactiva del estado global de la flota, rutas en circulación e incidencias en `/src/context/DeliveryContext.tsx`.

---

## Estructura de Navegación y Pantallas

### 1. Cabecera fija y Menú Lateral (Drawer)
- Cabecera fija con botón de menú arriba a la izquierda, logotipo, selector de estado y control de simulación en vivo (Pausar/Reanudar).
- Menú lateral deslizante con animación suave y fondo oscurecido accesible con 5 destinos:
  1. **Inicio** (`/`)
  2. **Mapa Madrid** (`/mapa`)
  3. **Configuración vehículos** (`/vehiculos`)
  4. **Repartos** (`/repartos`)
  5. **Programar rutas** (`/programar`)

---

### 2. Pantalla 1: Inicio (`/`)
Panel de control con la operativa del día:
- **Fecha de hoy en español**: Formateada dinámicamente con capitalización (ej. *"Jueves, 15 de octubre de 2026"*).
- **Tarjetas de KPIs**:
  - Entregas planificadas hoy.
  - Entregas completadas con porcentaje de avance.
  - Vehículos disponibles hoy en la flota (ej. *"7 de 8"*).
  - Vehículos activos en ruta.
- **Resumen del estado de cada ruta**: Nombre, barra de progreso con color distintivo, número de paradas realizadas y estado (`Pendiente` / `En ruta` / `Completada`).
- **Mini Mapa**: Visualizador interactivo de Madrid con las rutas activas y acceso directo a pantalla completa.
- **Contador de incidencias**: Alerta viva con acceso directo al listado de tráfico.
- **Gráfico de Entregas**: Distribución de paquetes entregados vs pendientes por zona (Recharts).

---

### 3. Pantalla 2: Mapa Madrid (`/mapa`)
Monitorización en gran formato de la movilidad en Madrid:
- Centrado en Madrid (`[40.4168, -3.7038]`).
- Trazado de rutas urbanas reales como polilíneas de colores diferenciados.
- **Marcadores de vehículos en tiempo real**: Se desplazan de manera continua e interpolada cada 3 segundos a lo largo de las calles de Madrid.
- **Hub Logístico Central**: Marcador destacado en Méndez Álvaro / Abroñigal (`[40.3942, -3.6765]`), punto de salida y retorno.
- **Paradas de entrega**: Marcadores numerados con estado de entrega (`✓` entregada o número pendiente).
- **Popups interactivos**: Al pulsar sobre cualquier vehículo o parada se muestra el progreso, vehículo asignado, próxima parada, dirección y peso de la carga.
- **Leyenda flotante**: Control desplegable con las rutas activas, progreso porcentual y filtros para aislar rutas individuales en el mapa.

---

### 4. Pantalla 3: Configuración de Vehículos (`/vehiculos`)
Gestión completa de la flota de reparto:
- **Flota inicial con 8 vehículos**: Diversidad de tipologías:
  - Furgonetas eléctricas y diésel Euro 6.
  - Camiones ligeros para gran volumen (AZCA / Chamartín).
  - Motos de reparto rápido.
  - Bicicletas de carga para la almendra central (Sol / Gran Vía).
- **Distintivos ambientales de la DGT**: Badges con colores oficiales:
  - **0 Emisiones** (Azul)
  - **ECO** (Verde / Turquesa)
  - **C** (Verde)
  - **B** (Amarillo)
  - **Sin Distintivo** (Gris)
- **Operaciones CRUD**: Modal para dar de alta nuevos vehículos, editar sus especificaciones o eliminarlos.
- **Calendario Mensual Interactivo**:
  - Navegable por meses con nombres en español.
  - Resalta el día de hoy con distintivo `HOY`.
  - Permite activar o desactivar la disponibilidad de cada vehículo pulsando sobre cada día.
  - La disponibilidad del día actual alimenta automáticamente el KPI del Inicio.

---

### 5. Pantalla 4: Repartos en Tiempo Real (`/repartos`)
Supervisión operativa de las entregas y resolución de problemas:
- Indicadores inmediatos: **Entregas Totales**, **Realizadas**, **Pendientes** e **Incidencias**.
- Mapa operativo de repartos con tráfico activo.
- Barras de progreso en vivo por ruta.
- **Listado de incidencias en directo**:
  - Hora del evento, ruta afectada, gravedad (`baja`, `media`, `alta`) y ubicación (ej. *Castellana*, *Gran Vía*, *Alcalá*).
  - Filtros por gravedad y opción de visualizar incidencias resueltas.
  - Botón de **"Resolver"** para despejar incidencias de la operativa.
  - Simulación periódica en segundo plano y botón de prueba **"Simular nueva incidencia"**.

---

### 6. Pantalla 5: Programar Rutas (`/programar`)
Dimensionamiento inteligente de nuevas rutas:
- Mínimo 5 plantillas de zonas urbanas:
  1. *Centro Histórico (Almendra Central / ZBE)*
  2. *Norte Castellana - Chamartín*
  3. *Este Ventas - Ciudad Lineal*
  4. *Sur Madrid Río - Usera*
  5. *Oeste Argüelles - Casa de Campo*
- Selector de fecha de ejecución.
- Selector del vehículo disponible para dicha fecha.
- **Cálculo dinámico en tiempo real**:
  - Vehículos requeridos en función de la carga.
  - Distancia total (km).
  - Emisiones de CO₂ producidas (kg) según el distintivo ambiental DGT del vehículo seleccionado.
  - Coste total estimado (€) (coste fijo de operativa + variable por km).
- **Alerta de capacidad**: Avisa preventivamente si no hay suficientes vehículos disponibles para la fecha elegida.
- **Previsualización en mapa**: Trazado del recorrido antes de confirmar.
- Botón **"Programar esta ruta"** con modal de confirmación y alta inmediata en el sistema.

---

## Arquitectura del Proyecto

```
gestor-entregas/
├── public/                 # Iconos y recursos estáticos
├── src/
│   ├── types/              # Definiciones TypeScript de datos (Vehicle, Route, Stop, etc.)
│   ├── data/               # Datos simulados (mock)
│   │   ├── hub.ts          # Coordenadas y datos del Hub Central de Madrid
│   │   ├── vehicles.ts     # Flota inicial de vehículos con pegatinas DGT
│   │   ├── routes.ts       # Rutas con coordenadas GPS reales de Madrid
│   │   └── mockIncidents.ts# Banco de incidencias urbanas
│   ├── context/
│   │   └── DeliveryContext.tsx # Estado global, simulación GPS y cálculo de KPIs
│   ├── utils/
│   │   ├── dateUtils.ts    # Formato de fechas en español
│   │   ├── geoUtils.ts     # Interpolación matemática GPS para polilíneas
│   │   └── mapIcons.ts     # DivIcons SVG para Leaflet (vehículos, hub, paradas)
│   ├── components/
│   │   ├── common/         # BadgeDGT, KpiCard, RouteProgress, IncidentBadge, Modal
│   │   ├── layout/         # Header, Drawer, Layout
│   │   ├── map/            # MapView (pantalla completa), RouteMapMini
│   │   ├── vehicles/       # VehicleCalendar, VehicleFormModal
│   │   ├── incidents/      # IncidentList
│   │   └── schedule/       # RouteCalculator
│   ├── pages/              # Las 5 vistas de la aplicación
│   │   ├── DashboardPage.tsx
│   │   ├── FullMapPage.tsx
│   │   ├── VehiclesPage.tsx
│   │   ├── DeliveriesPage.tsx
│   │   └── PlanRoutePage.tsx
│   ├── App.tsx             # Enrutamiento con React Router
│   ├── main.tsx            # Punto de montaje React
│   └── index.css           # Estilos Tailwind CSS y Leaflet
├── index.html              # HTML en español con título RutaMadrid
├── vite.config.ts          # Configuración Vite con plugin de Tailwind
└── package.json            # Dependencias y scripts
```
