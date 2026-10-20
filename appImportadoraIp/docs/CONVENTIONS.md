# Convenciones de Gestión Importadora

Guía corta para saber dónde va cada cosa y cómo se escribe. Si algo no está aquí, se decide siguiendo estas mismas reglas.

## 1. La app es el shell (no se agregan más componentes app)

Toda la app vive dentro de los componentes de `src/app/componentApp`:

| Componente | Qué hace |
|---|---|
| `SideMenu` | Elige el módulo y la subgestión (estado `ui`) |
| `MainContent` | Muestra la pantalla de la feature según el módulo y subgestión activos |
| `DrawerRight` | Auxiliar de lo que se hace en `MainContent`: carrito en el catálogo, o detalle/ajustes del objeto seleccionado |
| `AppHeader` | Barra superior (logo y selector de bodega) |

- No se crean más componentes en `app/`. Todo lo nuevo se desarrolla **dentro de una feature** y se conecta a estos componentes.
- Excepciones permitidas (cosas que se olvidaron): notificaciones (alertas flotantes), login y confirmaciones de acciones.

## 2. Estructura de una feature

```
features/<name>/
├── types/        contratos TypeScript            (obligatoria)
├── constants/    textos, claves, datos fijos
├── mocks/        datos de ejemplo
├── services/     llamadas a la API (usan api/client)
├── helpers/      funciones puras
├── selectors/    lecturas derivadas del estado
├── slices/       estado Redux
├── thunks/       acciones asíncronas
├── hooks/        hooks de la feature
├── components/   piezas de UI (cada una con su .css)
├── screens/      pantallas completas
└── index.ts      API pública                      (obligatoria)
```

- Solo se crean las carpetas que la feature necesita. No se crean carpetas vacías.
- **Orden dentro de una carpeta:** si pasa de ~8 archivos, se agrupa en subcarpetas con nombre lógico por función (camelCase). Ejemplos: shop/components/{productCard, catalog, cart}, wallet/components/{kpis, clientsTable, clientRow, account, billing}, auth/components/{branding, form}, app/componentApp/sideMenu/{item, footer}.
- En el shell (app/componentApp) pasa igual: header/warehouse, sideMenu/item y sideMenu/footer, drawerRight/parts.
- El detalle de qué hace cada archivo está en docs/ESTRUCTURA.md (se genera a partir de la cabecera de cada archivo).
- Dirección de dependencias: `app → features → global → api`.
- Dentro de una feature: `screens → components → slices/thunks → services → types/constants`.
- Una feature usa a otra solo por su `index.ts`.

## 3. Nombres

- **El código va en inglés** (archivos, funciones, variables, tipos, ids, estados).
- **Lo que ve el cliente va en español** (labels, textos, mensajes).
- Nombres simples: `getX`, `formatX`, `selectX`, `applyX`, `setX`.
- Archivos por capa: `wallet.slice.ts`, `wallet.types.ts`, `wallet.constants.ts`, `wallet.helpers.ts`.
- Los ids nunca son texto visible. Ejemplo: subgestión `{ id: 'catalog', label: 'Catálogo' }`.

Equivalencias ya aplicadas (código → texto del cliente):

| Módulo | Texto |
|---|---|
| `shop` | Tienda |
| `cashRegister` | Gestión Caja |
| `wallet` | Gestión Cartera |
| `inventory` | Gestión Inventario |
| `thirdParties` | Gestión Terceros |
| `reports` | Reportes de Ventas |

| Estado de crédito | Texto |
|---|---|
| `upToDate` | Al día |
| `warning30` | Alerta (30d) |
| `overdue60` | En mora (>60d) |
| `blocked` | Bloqueado |

## 4. Comentarios

- Todos los comentarios van en español, cortos y directos.
- Cada archivo lleva una cabecera: qué es y con qué conecta.
- Cada función lleva una línea: cómo funciona y dónde conecta.
- Los cambios se dejan como nota corta: `// ojo: ...`.
- **El código comentado no se borra**: sirve de referencia.

## 5. Estilos

- Todo valor visual (color, tamaño, radio, sombra, movimiento) vive en `src/styles/tokens.css`.
- Cada componente tiene su `.css` y solo usa `var(--token)`.
- Las clases llevan el prefijo del componente (ej. credit-table-row, product-card-btn-add-to-cart).
- No se usa !important: se gana por especificidad (ej. .a.a-active).
- Estilos en línea solo para valores que cambian en ejecución (ej. el ancho de una barra de progreso); lo estático va al CSS.

## 5b. Tamaño de los archivos

- Un archivo hace una sola cosa. Meta: menos de 150 líneas (TSX y CSS). Los datos de ejemplo (mocks) y tokens.css son la excepción.
- Si un componente crece, se parte en partes con su propio .css (ej. ProductCard → ProductCardStock, ProductCardPricing, ProductCardActions).
- La lógica con estado va en un hook de la feature (ej. useCreditPayment) y los cálculos en helpers o selectors; el componente solo compone.

## 5c. Escalas de diseño (en tokens.css)

- Texto: 12 · 13 · 14 · 16 · 18 · 20 · 24 (más íconos 36 y 42). Mínimo 12px.
- Radios: sm 6 · md 8 · lg 12 · pill · circle.
- Sombras: rest · card · card-hover; foco con --focus-outline y --ring-focus.
- Espaciado: --space-1..6 (4 · 8 · 12 · 16 · 24 · 32).
- Contraste mínimo 4.5:1 para texto; el foco con teclado siempre es visible.

## 6. Lo que viene (tenerlo en cuenta al escribir código)

- **Tiempo real (feature realtime, hecha con contrato provisional):** el Swagger del backend (185 rutas) NO documenta websocket ni webhooks. Se activa con VITE_WS_URL (vacío = desactivado, no se conecta a nada). Un evento nuevo es una línea en realtime.handlers; el formato del mensaje vive solo en realtime.adapter; el stock llega como valor absoluto (applyStockUpdate).
- **Facturas, PDF, imprimir, descargar y cargar archivos:** cada uno con su service y su respaldo. Irán como features nuevas (por ejemplo `invoices`) apoyadas en helpers de archivos en `global/`.
- **Sesión (hecho):** feature auth (login copiado de importadora-online). Token con la clave access_token; recordarme decide localStorage o sessionStorage; auth no va en redux-persist; un 401 cierra la sesión (api/client avisa y el store la cierra).
- **Alertas flotantes:** `sonner` con la misma configuración de Grandma's Liquors (`position="top-center"`, `richColors`, `closeButton`).

## 7. Carpetas reservadas

`src/global2/` y `src/features2/` se conservan tal cual. No se tocan ni se eliminan.
