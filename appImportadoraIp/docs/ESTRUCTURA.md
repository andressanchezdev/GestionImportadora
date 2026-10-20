# Estructura y archivos de `appImportadoraIp`

Generado a partir de la cabecera de comentario de cada archivo: **qué hace** y **con qué conecta**. Las carpetas reservadas `global2/` y `features2/` no se tocan.

## Cómo leer la estructura

- **Sentido de las dependencias:** `app → features → global → api`. Una feature usa a otra solo por su `index.ts`.
- **Dentro de una feature (de abajo hacia arriba):** `types → constants/mocks → helpers → services/selectors → slices → thunks → hooks → components → screens`.
- **Regla de orden:** una carpeta no pasa de ~8 archivos; si crece, se agrupa en subcarpetas con nombre lógico por función (`productCard/`, `catalog/`, `cart/`, `billing/`…).
- **Pareja de archivos:** cada componente `.tsx` lleva al lado su `.css` con el mismo nombre.

## Resumen por carpeta de primer nivel

| Carpeta | Qué contiene |
|---|---|
| `src/api/` | Capa de acceso al backend REST (axios, endpoints, errores y salud). |
| `src/app/` | El shell de la aplicación: layout, store y los cuatro componentes fijos. |
| `src/features/` | Toda la lógica de negocio, una carpeta por módulo. |
| `src/global/` | Piezas compartidas por todas las features. |
| `src/styles/` | Única fuente de valores visuales (colores, texto, radios, sombras, espaciado y movimiento). |
| `src/assets/` | Íconos, imágenes del login y logos. |

### `src/ (raíz)`

Raíz de `src`: arranque de la app y estilos base.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `App.css` | reset y estilos base de la app; importa los tokens | estilos de App |
| `App.tsx` | raíz de la app, solo monta StoreApp | app/layout/StoreApp y global AppToaster (alertas flotantes) |
| `main.tsx` | punto de entrada: monta la app en el #root del index.html | index.html (el script apunta aquí), App.tsx y App.css |

### `src/api/`

Capa de acceso al backend REST (axios, endpoints, errores y salud).

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `client.ts` | instancia de axios con token Bearer y manejo de errores | api/config, api/types; lo usarán los services de cada feature |
| `config.ts` | URL base, timeout y endpoints del backend | api/client, api/health |
| `errors.ts` | traduce cualquier error de axios (red, timeout o HTTP) a un AppApiError legible para el cliente | api/client (interceptores) y features/auth (mensaje de login); ojo: antes vivía dentro de client.ts |
| `health.ts` | prueba de conexión con el backend y latencia en ms | api/client y api/config (HEALTH.CHECK); lo usa global/hooks/useApiHealth para mostrar la latencia en el footer del menú |
| `index.ts` | API pública de la capa api | features y app (importan desde aquí) |

### `src/api/types/`

Tipos de las respuestas de la API.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `api.types.ts` | contratos de respuesta, paginación y error de la API | api/client, api/health |

### `src/app/componentApp/contentMain/`

Contenido central: elige la pantalla según el módulo y la subgestión.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `MainContent.css` | estilos del lienzo central | estilos de MainContent |
| `MainContent.tsx` | lienzo central: muestra la pantalla según el módulo y subitem activos | navigation (estado ui), screenRegistry (qué pantalla toca) y MainContentPlaceholder (si aún no hay pantalla) |
| `MainContentPlaceholder.css` | estilos del aviso de módulo aún sin pantalla (Próxima Fase) | estilos de MainContentPlaceholder |
| `MainContentPlaceholder.tsx` | aviso de módulo o subgestión que todavía no tiene pantalla ("Próxima Fase") | MainContent (cuando screenRegistry no devuelve pantalla); título e ícono de navigation |
| `screenRegistry.ts` | mapa de qué pantalla de feature se muestra por módulo y subgestión | MainContent (pide la pantalla); las pantallas vienen de features/shop y features/wallet |

### `src/app/componentApp/drawerRight/`

Panel derecho contextual: carrito u objeto seleccionado.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `drawerRegistry.ts` | define cuándo se abre el panel derecho y qué muestra en cada caso | DrawerRight (lo consulta); contenido de features/shop (carrito) y features/wallet (estado de cuenta) |
| `DrawerRight.css` | estilos del contenedor del panel derecho (ancho animado y cuerpo con scroll) | estilos de DrawerRight |
| `DrawerRight.tsx` | panel derecho contextual: carrito en el catálogo, o detalle del objeto seleccionado; en cualquier otro caso no se muestra | drawerRegistry (modo y contenido), DrawerHeader, DrawerTab (carrito contraído), useDrawerPresence (animación de salida), global useEscapeKey |
| `useDrawerPresence.ts` | deja el panel montado mientras se cierra, para que se pueda ver la animación de salida | DrawerRight; recibe el modo actual (o null) y devuelve qué modo mostrar, si está montado y si está abierto |

### `src/app/componentApp/drawerRight/parts/`

Piezas del panel: encabezado único y pestaña del carrito contraído.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `DrawerHeader.css` | estilos del encabezado único del panel derecho | estilos de DrawerHeader |
| `DrawerHeader.tsx` | encabezado único del panel derecho: ícono, título, detalle y botón cerrar | DrawerRight (le pasa el ícono, los textos de la feature y la acción de cerrar) |
| `DrawerTab.css` | estilos de la pestaña lateral del carrito contraído | estilos de DrawerTab |
| `DrawerTab.tsx` | pestaña lateral con el contador del carrito cuando el panel está contraído | DrawerRight (le pasa el ícono, el conteo y la acción de volver a abrir) |

### `src/app/componentApp/header/`

Barra superior con el nombre del sistema.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `AppHeader.css` | estilos de la barra superior | estilos de AppHeader |
| `AppHeader.tsx` | barra superior: logo con el nombre del sistema y el selector de bodega | WarehouseSelector (bodega activa); ojo: el estado de la API (latencia) ahora se muestra en el footer del menú (ApiStatus) |

### `src/app/componentApp/header/warehouse/`

Selector de bodega y su menú desplegable.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `WarehouseMenu.css` | estilos del menú desplegable de bodegas | estilos de WarehouseMenu |
| `WarehouseMenu.tsx` | lista desplegable de bodegas disponibles con la activa marcada | WarehouseSelector (le pasa la bodega activa y recibe la elegida); lista de features/warehouses |
| `WarehouseSelector.css` | estilos del botón selector de bodega del encabezado | estilos de WarehouseSelector |
| `WarehouseSelector.tsx` | botón que muestra la bodega activa y abre el menú para cambiarla | navigation (bodega activa), features/warehouses (lista), global useClickOutside (cierra con clic fuera o Escape) |

### `src/app/componentApp/sideMenu/`

Menú lateral: contenedor.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `SideMenu.css` | estilos del contenedor del menú lateral (lista y footer) | estilos de SideMenu |
| `SideMenu.tsx` | menú lateral: lista de módulos con sus subgestiones y, abajo, el estado de la API y el usuario | navigation (MENU_ITEMS y acciones del estado ui); partes: SideMenuItem, ApiStatus y SideMenuUser |

### `src/app/componentApp/sideMenu/footer/`

Pie del menú: estado de la API y usuario con cerrar sesión.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `ApiStatus.css` | estilos del estado de la API en el footer del menú | estilos de ApiStatus |
| `ApiStatus.tsx` | estado de la conexión con la API en el footer del menú (conectando, en línea con ms, o sin conexión) | global useApiHealth (consulta); ojo: antes este indicador estaba en el header |
| `SideMenuUser.css` | estilos de la tarjeta de usuario del menú lateral | estilos de SideMenuUser |
| `SideMenuUser.tsx` | tarjeta del usuario en el footer del menú (avatar con iniciales, nombre, rol y botón de cerrar sesión) | features/auth (usuario de la sesión y logoutThunk); las iniciales salen de global/helpers/format |

### `src/app/componentApp/sideMenu/item/`

Cada módulo del menú y sus subgestiones.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `SideMenuItem.css` | estilos de cada módulo del menú y de su animación de selección | estilos de SideMenuItem |
| `SideMenuItem.tsx` | un módulo del menú (ícono, nombre, insignia y flecha) con sus subgestiones debajo | SideMenu (le pasa el módulo y recibe los clics), SideMenuSubitems (la lista que se despliega) |
| `SideMenuSubitems.css` | estilos de las subgestiones del menú (se despliegan animando la altura) | estilos de SideMenuSubitems |
| `SideMenuSubitems.tsx` | lista de subgestiones de un módulo; se despliega animando su altura cuando el módulo está activo | SideMenuItem (subitems, si está abierta y cuál está activo); el id de cada subgestión sale de navigation |

### `src/app/layout/`

Provider de redux, puerta de entrada (login o ERP) y layout del ERP.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `AuthGate.tsx` | puerta de entrada: sin sesión muestra el login, con sesión muestra el ERP | features/auth (selector y pantalla de login) y ErpLayout |
| `ErpLayout.css` | estilos del layout del ERP (header, cuerpo con menú, contenido y drawer) | estilos de ErpLayout |
| `ErpLayout.tsx` | layout del ERP: header, menú lateral, contenido central y drawer derecho | componentApp/* (header, sideMenu, contentMain, drawerRight) y features/realtime (useRealtime); lo muestra AuthGate cuando hay sesión |
| `StoreApp.tsx` | raíz de la app con el store de redux: pone el Provider y la puerta de entrada (login o ERP) | app/store (store) y AuthGate |

### `src/app/store/`

Configuración de redux, persistencia y reducers raíz.

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `rootReducer.ts` | junta los reducers de cada feature (ui, shop, wallet, auth, realtime) | features/*/index, app/store/store |
| `store.ts` | configura redux + persistencia y exporta los tipos RootState y AppDispatch | rootReducer, global/helpers/storage; ojo: antes se llamaba store.tsx (no tenía JSX) |

### `src/assets/icons/`

36 íconos SVG. Los usados hoy: store, wallet, cart, database, package, user, file-text, building y logout; el resto queda como biblioteca de reserva.

### `src/assets/images/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `login-fondo.webp` | Fondo de la pantalla de login (copiado de importadora-online) | LoginScreen.css |
| `login-ilustracion.svg` | Ilustración del login (23,5 MB → 0,7 MB, mismas formas) | LoginHero |

### `src/assets/logos/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `icon.ico` | Ícono de la marca | reserva |

### `src/features/auth/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `index.ts` | API pública de la feature auth | AuthGate (pantalla y selector), SideMenuUser (usuario y cerrar sesión), rootReducer (reducer), store (cerrar sesión por 401) |

### `src/features/auth/components/branding/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `LoginBrand.css` | estilos de la marca del login (copia del diseño de importadora-online) | estilos de LoginBrand |
| `LoginBrand.tsx` | marca del login: logo "IP" sobre cuadro oscuro y la palabra "Online" | LoginForm (va arriba del formulario); el texto sale de auth.constants |
| `LoginHero.css` | estilos de la ilustración del login (copia del diseño de importadora-online) | estilos de LoginHero |
| `LoginHero.tsx` | ilustración grande del lado izquierdo del login | LoginScreen (la coloca sobre el fondo); la imagen es assets/images/login-ilustracion.svg |
| `LoginWelcome.css` | estilos del saludo del login (copia del diseño de importadora-online) | estilos de LoginWelcome |
| `LoginWelcome.tsx` | título "Bienvenido" y frase de bienvenida del login | LoginForm (va entre la marca y los campos); los textos salen de auth.constants |

### `src/features/auth/components/form/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `LoginActions.css` | estilos de los botones del login (copia del diseño de importadora-online) | estilos de LoginActions |
| `LoginActions.tsx` | botones del login: "Iniciar sesión" (envía el formulario) y "Registrarse" | LoginForm (le dice si está ingresando); el envío lo maneja el <form> con useLoginForm |
| `LoginForm.css` | estilos del formulario del login (copia del diseño de importadora-online) | estilos de LoginForm |
| `LoginForm.tsx` | formulario del login: marca, saludo, campos, opciones y botones | useLoginForm (estado y envío) y las partes LoginBrand, LoginWelcome, LoginInput, LoginOptions y LoginActions |
| `LoginInput.css` | estilos del campo del login (copia del diseño de importadora-online) | estilos de LoginInput |
| `LoginInput.tsx` | campo de texto del login (correo o contraseña) con borde izquierdo amarillo | LoginForm (le pasa valor y cambio); props en types/auth.login.types |
| `LoginOptions.css` | estilos de la fila recordarme / olvidé mi contraseña (copia del diseño de importadora-online) | estilos de LoginOptions |
| `LoginOptions.tsx` | fila bajo los campos: "Recordarme" y "¿Has olvidado tu contraseña?" | LoginForm (recordarme y su cambio); useLoginForm decide dónde se guarda la sesión |

### `src/features/auth/constants/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `auth.constants.ts` | textos del login (lo que ve el cliente, en español) | los componentes del login y useLoginForm (mensajes) |

### `src/features/auth/helpers/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `auth.helpers.ts` | funciones puras del login: validar campos, armar el nombre y traducir errores | useLoginForm (validación), auth.thunks (mensaje de error), SideMenuUser (nombre) |
| `auth.session.ts` | puente entre la sesión guardada en el navegador y el estado de auth | global/helpers/session.storage (guarda y lee), auth.slice (estado inicial) y auth.thunks (guardar y borrar) |

### `src/features/auth/hooks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `useLoginForm.ts` | estado y envío del formulario de login (correo, contraseña, recordarme) con alertas flotantes | auth.helpers (validación), auth.thunks (login), auth.selectors (¿ingresando?), global toast; lo usa LoginForm |

### `src/features/auth/screens/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `LoginScreen.css` | estilos de la pantalla de login (copia del diseño de importadora-online) | estilos de LoginScreen |
| `LoginScreen.tsx` | pantalla completa de login: fondo, ilustración a la izquierda y panel blanco con el formulario | LoginHero y LoginForm; la muestra AuthGate cuando no hay sesión |

### `src/features/auth/selectors/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `auth.selectors.ts` | lecturas simples del estado de la sesión | AuthGate (¿hay sesión?), SideMenuUser (usuario), LoginForm (¿está ingresando?) |

### `src/features/auth/services/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `auth.service.ts` | llamada al backend para iniciar sesión (POST /auth/login) | api/client (axios con interceptores) y api/config (endpoint); la usa auth.thunks |

### `src/features/auth/slices/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `auth.slice.ts` | estado de la sesión: usuario, estado (anónimo, ingresando, autenticado) y último error | auth.thunks (login/logout), auth.selectors (lecturas) y AuthGate (decide login o ERP) |

### `src/features/auth/thunks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `auth.thunks.ts` | acciones asíncronas de la sesión: iniciar y cerrar sesión | auth.service (login), auth.session (guardar/borrar) y auth.slice (reacciona a los resultados) |

### `src/features/auth/types/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `auth.login.types.ts` | props de las partes del formulario de login | LoginInput, LoginOptions y LoginActions (las compone LoginForm) |
| `auth.types.ts` | contratos de la sesión: usuario, credenciales, respuesta del login y estado del slice | auth.service, auth.slice, auth.thunks, auth.selectors y los componentes del login |

### `src/features/navigation/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `index.ts` | API pública de la feature (lo único que deben importar otras features y app) |  |

### `src/features/navigation/constants/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `menuItems.constants.ts` | lista fija del menú lateral (módulos y subgestiones) | SideMenu (lo pinta), navigation.slice (elige el primer subitem), MainContent (decide la pantalla) |
| `navigation.constants.ts` | estado inicial de la navegación (módulo, subgestión, bodega y caja de arranque) | navigation.slice (initialState) |

### `src/features/navigation/helpers/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `navigation.helpers.ts` | funciones simples para leer el menú sin repetir lógica | MainContent (título), menuItems.constants (fuente de datos) |

### `src/features/navigation/slices/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `navigation.slice.ts` | estado de navegación (clave 'ui'): módulo, subitem, bodega y usuario activos | SideMenu, MainContent, DrawerRight, AppHeader (leen/disparan estas acciones) |

### `src/features/navigation/types/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `navigation.types.ts` | contratos del menú y del estado de navegación (ui) | menuItems.constants, navigation.slice, SideMenu, MainContent, DrawerRight |

### `src/features/realtime/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `index.ts` | API pública de la feature realtime (tiempo real por websocket) | ErpLayout (useRealtime), rootReducer (reducer); pendiente: contrato real de eventos del backend (ver realtime.constants) |

### `src/features/realtime/constants/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `realtime.constants.ts` | tipos de evento conocidos y tiempos de reconexión | realtime.handlers (qué hacer con cada evento) y realtime.backoff (esperas) |

### `src/features/realtime/helpers/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `realtime.adapter.ts` | convierte el mensaje crudo del websocket en un RealtimeEvent (en inglés) | realtime.service (lo llama por cada mensaje); es el ÚNICO lugar que conoce la forma del mensaje del servidor |
| `realtime.backoff.ts` | cuánto esperar antes de reconectar (crece al doble hasta un tope) | realtime.service (lo usa en cada reintento) |
| `realtime.handlers.ts` | registro de qué hacer con cada tipo de evento (evento → acción de una feature) | realtime.thunks (lo llama por cada evento) y features/shop (applyStockUpdate); para un evento nuevo se agrega una línea |
| `realtime.url.ts` | arma la URL del websocket con el token de la sesión | realtime.thunks (al iniciar la conexión) |

### `src/features/realtime/hooks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `useRealtime.ts` | abre el tiempo real cuando hay sesión y lo cierra al cerrar sesión o salir | features/auth (¿hay sesión?), realtime.thunks; lo llama ErpLayout una sola vez |

### `src/features/realtime/selectors/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `realtime.selectors.ts` | lectura del estado del tiempo real | cualquier componente que quiera mostrar si la conexión está abierta |

### `src/features/realtime/services/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `realtime.service.ts` | conexión websocket con reconexión automática (espera creciente) y cierre limpio | realtime.adapter (mensajes), realtime.backoff (esperas); la crea realtime.thunks al iniciar sesión |

### `src/features/realtime/slices/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `realtime.slice.ts` | estado de la conexión en tiempo real: estado y hora del último evento | realtime.thunks (lo actualiza), realtime.selectors (lectura) |

### `src/features/realtime/thunks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `realtime.thunks.ts` | acciones para abrir y cerrar la conexión en tiempo real | api/config (WS_URL), global/session.storage (token), realtime.service, realtime.handlers y realtime.slice; las llama useRealtime |

### `src/features/realtime/types/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `realtime.types.ts` | contratos del tiempo real: estado de la conexión, evento recibido y conexión | realtime.service, realtime.adapter, realtime.handlers, realtime.slice y realtime.thunks |

### `src/features/shop/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `index.ts` | API pública de la feature shop | MainContent, DrawerRight, rootReducer |

### `src/features/shop/components/cart/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `ShopCartDrawer.css` | estilos del contenedor y la lista del carrito (el encabezado está en DrawerHeader.css) | estilos de ShopCartDrawer |
| `ShopCartDrawer.tsx` | carrito POS: lista de items (o vacío) y pie con total | shop.slice y shop.selectors; las partes son ShopCartItem, ShopCartEmpty y ShopCartFooter; lo muestra DrawerRight en la tienda |
| `ShopCartEmpty.css` | estilos del carrito vacío | estilos de ShopCartEmpty |
| `ShopCartEmpty.tsx` | mensaje del carrito vacío | ShopCartDrawer (se muestra cuando no hay items) |
| `ShopCartFooter.css` | estilos del pie del carrito (total y acciones) | estilos de ShopCartFooter |
| `ShopCartFooter.tsx` | pie del carrito: total a facturar, vaciar y finalizar pedido | shop.slice (vaciar), shop.selectors (total), global toast (aviso de pedido listo) |
| `ShopCartItem.css` | estilos de cada línea del carrito (datos, cantidad y precios) | estilos de ShopCartItem |
| `ShopCartItem.tsx` | una línea del carrito: datos del repuesto, cantidad y precios | shop.slice (cambiar cantidad y quitar); la pinta ShopCartDrawer por cada item |

### `src/features/shop/components/catalog/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `ShopCatalogEmpty.css` | estilos del estado vacío del catálogo | estilos de ShopCatalogEmpty |
| `ShopCatalogEmpty.tsx` | estado vacío cuando ningún repuesto coincide con los filtros | ShopCatalogScreen (le pasa la bodega, si hay filtros y la acción de restablecer) |
| `ShopCatalogFilters.css` | estilos de las categorías en pills y el resumen de resultados | estilos de ShopCatalogFilters |
| `ShopCatalogFilters.tsx` | categorías en pills y resumen de resultados ("Mostrando X de Y") | shop.slice (categoría seleccionada); los conteos llegan por props desde ShopCatalogScreen |
| `ShopCatalogToolbar.css` | estilos de la fila de búsqueda, marca, stock y limpiar filtros | estilos de ShopCatalogToolbar |
| `ShopCatalogToolbar.tsx` | fila de búsqueda: texto, marca, "con stock" y limpiar filtros | shop.slice (filtros), shop.selectors (hay filtros activos), global SearchBar |

### `src/features/shop/components/productCard/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `ProductCard.css` | estilos de la tarjeta de producto | estilos de ProductCard |
| `ProductCard.tsx` | tarjeta de producto: marca, ubicación, datos del repuesto y sus tres partes (stock, precios, acciones) | ShopCatalogScreen (le pasa los datos y recibe el agregar al carrito); usa shop.helpers y las partes ProductCard* |
| `ProductCardActions.css` | estilos de la cantidad y el botón de ordenar de la tarjeta | estilos de ProductCardActions |
| `ProductCardActions.tsx` | stepper de cantidad y botón de ordenar de la tarjeta | ProductCard (cantidad y acciones); no guarda estado, todo llega por props |
| `ProductCardPricing.css` | estilos del precio y los niveles P0-P3 de la tarjeta | estilos de ProductCardPricing |
| `ProductCardPricing.tsx` | precio del nivel activo y selector rápido de tarifa P0 - P3 | ProductCard (nivel y cambio de nivel); formatos de global/helpers/format |
| `ProductCardStock.css` | estilos de la disponibilidad de stock de la tarjeta | estilos de ProductCardStock |
| `ProductCardStock.tsx` | disponibilidad de stock de la tarjeta (agotado, bajo o disponible) | ProductCard (le pasa el estado y la cantidad); el estado sale de shop.helpers (getStockStatus) |

### `src/features/shop/constants/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `shop.constants.ts` | categorías, marcas, niveles de precio, filtros y estado inicial | shop.slice (initialState), ShopCatalogScreen |

### `src/features/shop/helpers/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `shop.helpers.ts` | funciones puras de la tienda (stock, precio por nivel y emoji de categoría) | ProductCard (los usa para pintar) y shop.selectors |

### `src/features/shop/mocks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `shop.mocks.ts` | productos de ejemplo (mientras no llegue la API real) | shop.constants (INITIAL_SHOP_STATE los usa como estado inicial) |

### `src/features/shop/screens/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `ShopCatalogScreen.css` | estilos del catálogo | estilos de ShopCatalogScreen |
| `ShopCatalogScreen.tsx` | catálogo de repuestos: arma la barra, los filtros, el grid de tarjetas o el estado vacío | shop.slice, shop.selectors, ProductCard y las partes ShopCatalog*; la monta MainContent |

### `src/features/shop/selectors/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `shop.selectors.ts` | lecturas derivadas del estado de la tienda (filtrado, cantidades y totales del carrito) | ShopCatalogScreen y ShopCartDrawer; leen state.shop y la bodega activa de state.ui |

### `src/features/shop/slices/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `shop.slice.ts` | estado de tienda: filtros, carrito y selección de producto | ShopCatalogScreen, ProductCard, ShopCartDrawer |

### `src/features/shop/types/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `shop.card.types.ts` | props de la tarjeta de producto y de sus partes (stock, precios y acciones) | ProductCard, ProductCardStock, ProductCardPricing, ProductCardActions |
| `shop.cart.types.ts` | props de las partes del carrito | ShopCartItem (la pinta ShopCartDrawer) |
| `shop.catalog.types.ts` | props de las partes del catálogo (filtros y estado vacío) | ShopCatalogFilters y ShopCatalogEmpty (las usa ShopCatalogScreen) |
| `shop.types.ts` | contratos de producto, precios, filtros y carrito | shop.constants, shop.slice y los componentes de shop |

### `src/features/wallet/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `index.ts` | API pública de la feature wallet | MainContent, DrawerRight, rootReducer |

### `src/features/wallet/components/account/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `CreditAccountDetail.css` | estilos del cuerpo del estado de cuenta (el encabezado está en DrawerHeader.css) | estilos de CreditAccountDetail |
| `CreditAccountDetail.tsx` | estado de cuenta de un cliente: métricas, abono y facturas | CreditAccountDrawer (le pasa el cliente), useCreditPayment (abonos) |
| `CreditAccountDrawer.tsx` | contenido del panel derecho en cartera: estado de cuenta del cliente seleccionado | wallet.slice (cliente seleccionado); muestra CreditAccountEmpty o CreditAccountDetail; lo muestra DrawerRight |
| `CreditAccountEmpty.css` | estilos del mensaje cuando no hay cliente seleccionado | estilos de CreditAccountEmpty |
| `CreditAccountEmpty.tsx` | mensaje del panel cuando no hay ningún cliente seleccionado | CreditAccountDrawer (se muestra mientras selectedCustomerId es null) |
| `CreditAccountMetrics.css` | estilos del saldo adeudado y el cupo disponible | estilos de CreditAccountMetrics |
| `CreditAccountMetrics.tsx` | banner con el saldo adeudado y el cupo disponible del cliente | CreditAccountDetail (le pasa los dos valores); formato de global/helpers/format |

### `src/features/wallet/components/billing/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `CreditInvoiceCard.css` | estilos de la tarjeta de cada factura pendiente | estilos de CreditInvoiceCard |
| `CreditInvoiceCard.tsx` | tarjeta de una factura: número, estado, fechas, saldos y botón de pagar | CreditInvoiceList (por cada factura); el pago lo ejecuta useCreditPayment vía onPay |
| `CreditInvoiceList.css` | estilos de la sección de facturas pendientes | estilos de CreditInvoiceList |
| `CreditInvoiceList.tsx` | sección de facturas pendientes del cliente (lista o mensaje de "al día") | CreditAccountDetail (facturas y acción de pagar); pinta una CreditInvoiceCard por factura |
| `CreditPaymentForm.css` | estilos del formulario de abono y su aviso de éxito | estilos de CreditPaymentForm |
| `CreditPaymentForm.tsx` | formulario de abono rápido (monto + botón Abonar) | CreditAccountDetail (monto y acción llegan por props desde useCreditPayment) |

### `src/features/wallet/components/clientRow/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `CreditClientRow.css` | estilos de cada fila de cliente (datos, uso de cupo, estado y botón) | estilos de CreditClientRow |
| `CreditClientRow.tsx` | fila de un cliente: datos, cupo, saldo, uso, estado y botón "Ver Estado" | wallet.slice (seleccionar cliente), wallet.helpers (uso de cupo); partes: CreditUsageBar y CreditStatusBadge; la pinta CreditClientsTable |
| `CreditStatusBadge.css` | estilos de la etiqueta de estado de crédito | estilos de CreditStatusBadge |
| `CreditStatusBadge.tsx` | etiqueta del estado de crédito del cliente (al día, alerta, mora o bloqueado) | CreditClientRow (le pasa el estado); el texto y la variante salen de wallet.constants (CREDIT_STATUS_BADGES) |
| `CreditUsageBar.css` | estilos de la barra de uso del cupo | estilos de CreditUsageBar |
| `CreditUsageBar.tsx` | barra con el porcentaje de cupo usado (verde, ámbar o roja según el nivel) | CreditClientRow (le pasa el porcentaje); el nivel sale de wallet.helpers (getUsageLevel) |

### `src/features/wallet/components/clientsTable/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `CreditClientsTable.css` | estilos de la tabla de clientes | estilos de CreditClientsTable |
| `CreditClientsTable.tsx` | tabla de clientes: barra de filtros, encabezado y una fila por cliente | wallet.slice, wallet.selectors; las partes son CreditClientsToolbar y CreditClientRow; al hacer clic abre CreditAccountDrawer |
| `CreditClientsToolbar.css` | estilos de la búsqueda y las pestañas de estado de la tabla de clientes | estilos de CreditClientsToolbar |
| `CreditClientsToolbar.tsx` | barra de la tabla de clientes: búsqueda y pestañas de estado de crédito | wallet.slice (filtros), wallet.constants (pestañas), global SearchBar; la pinta CreditClientsTable |

### `src/features/wallet/components/kpis/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `WalletKpiHeader.css` | estilos de la fila de tarjetas de cartera | estilos de WalletKpiHeader |
| `WalletKpiHeader.tsx` | tarjetas de totales de cartera (cupo, por cobrar, mora, clientes) | wallet.slice (clientes), global StatCard |

### `src/features/wallet/constants/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `wallet.constants.ts` | filtros iniciales, estado inicial y textos de estados de crédito | wallet.slice (initialState) |

### `src/features/wallet/helpers/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `wallet.helpers.ts` | funciones puras de cartera (uso de cupo, monto del abono y reparto del pago) | CreditClientsTable, CreditAccountDrawer y wallet.slice (registerPayment) |

### `src/features/wallet/hooks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `useCreditPayment.ts` | maneja el abono de un cliente: monto digitado, validación, registro y mensaje de éxito | CreditAccountDetail (lo usa); wallet.slice (registerPayment), wallet.helpers (parsePaymentAmount), global toast |

### `src/features/wallet/mocks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `wallet.mocks.ts` | clientes con crédito de ejemplo (mientras no llegue la API real) | wallet.constants (INITIAL_WALLET_STATE los usa como estado inicial) |

### `src/features/wallet/screens/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `WalletScreen.css` | estilos de la pantalla de cartera | estilos de WalletScreen |
| `WalletScreen.tsx` | pantalla de cartera: KPIs arriba y tabla de clientes | WalletKpiHeader, CreditClientsTable; la monta MainContent |

### `src/features/wallet/selectors/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `wallet.selectors.ts` | lecturas derivadas del estado de cartera (KPIs y clientes filtrados) | WalletKpiHeader y CreditClientsTable; leen state.wallet |

### `src/features/wallet/slices/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `wallet.slice.ts` | estado de cartera: clientes, filtros, cliente seleccionado y abonos | WalletScreen, CreditClientsTable, CreditAccountDrawer |

### `src/features/wallet/types/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `wallet.account.types.ts` | props de las partes del estado de cuenta (detalle, abono y facturas) | CreditAccountDetail, CreditAccountMetrics, CreditPaymentForm, CreditInvoiceList, CreditInvoiceCard |
| `wallet.table.types.ts` | props de las partes de la tabla de clientes | CreditClientRow (la pinta CreditClientsTable), CreditUsageBar y CreditStatusBadge (las pinta CreditClientRow) |
| `wallet.types.ts` | contratos de clientes con crédito, facturas, KPIs y filtros | wallet.constants, wallet.slice y los componentes de wallet |

### `src/features/warehouses/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `index.ts` | API pública de la feature warehouses | AppHeader (selector de bodega) |

### `src/features/warehouses/constants/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `warehouses.constants.ts` | lista fija de bodegas | AppHeader (selector de bodega) |

### `src/features/warehouses/types/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `warehouse.types.ts` | contrato de bodega | warehouses.constants |

### `src/global/components/UI/atoms/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `AppToaster.tsx` | contenedor de las alertas flotantes (notificaciones arriba al centro) | App.tsx (se monta una sola vez) y global/helpers/toast (desde ahí se disparan) |

### `src/global/components/UI/molecules/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `SearchBar.css` | estilos de la barra de búsqueda | estilos de SearchBar |
| `SearchBar.tsx` | barra de búsqueda reutilizable con botón de limpiar | ShopCatalogScreen, CreditClientsTable |
| `StatCard.css` | estilos de la tarjeta de métrica | estilos de StatCard |
| `StatCard.tsx` | tarjeta de métrica (título, valor, subtítulo) | WalletKpiHeader |

### `src/global/helpers/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `format.ts` | formatos compartidos: moneda (pesos colombianos) e iniciales de un nombre | WalletKpiHeader, CreditClientsTable, CreditAccountDrawer, ProductCard, ShopCartDrawer |
| `session.storage.ts` | guarda, lee y borra la sesión (tokens y usuario) en el navegador | features/auth (helpers/auth.session); api/client lee el mismo 'access_token' para el header Authorization |
| `storage.ts` | almacenamiento seguro (localStorage) para redux-persist | app/store/store |
| `toast.ts` | punto único para lanzar alertas flotantes desde cualquier feature | AppToaster (las pinta); uso: toast.success('Título', { description: 'detalle' }) o toast.error(...) |

### `src/global/hooks/`

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `useApiHealth.ts` | consulta una vez la salud del backend y devuelve el estado (conectando, en línea o fuera de línea) con la latencia | api/health (checkApiHealth); lo usa ApiStatus en el footer del menú |
| `useClickOutside.ts` | ejecuta una función cuando se hace clic fuera del elemento o se presiona Escape | dropdowns y menús flotantes (hoy AppHeader tiene su propia copia, se migra después) |
| `useEscapeKey.ts` | ejecuta una función cuando se presiona Escape (solo mientras isActive sea true) | DrawerRight (cerrar el panel); para menús con clic fuera se usa useClickOutside |
| `useRedux.ts` | hooks de redux ya tipados (dispatch y selector), para no repetir el tipado en cada componente | app/store/store (solo tipos); los usan app/componentApp y todas las features |

### `src/styles/`

Única fuente de valores visuales (colores, texto, radios, sombras, espaciado y movimiento).

| Archivo | Qué hace | Conecta con |
|---|---|---|
| `tokens.css` | ============================================================================ | estilos de tokens |

## Reservadas (intactas)

- `src/features2/featuresdoclist.txt`
- `src/features2/featuresstoreBase.txt`
- `src/global2/components/UI/atoms/Badge.tsx`
- `src/global2/components/UI/atoms/Button.tsx`
- `src/global2/components/UI/atoms/Input.tsx`
- `src/global2/components/UI/molecules/QuantityStepper.tsx`
- `src/global2/components/UI/molecules/SearchBar.tsx`
- `src/global2/components/UI/molecules/StatCard.css`
- `src/global2/components/UI/molecules/StatCard.tsx`

## Raíz del proyecto

| Archivo | Qué hace |
|---|---|
| `index.html` | Página base; carga `/src/main.tsx`. |
| `package.json` · `package-lock.json` | Dependencias y comandos (`dev`, `build`, `lint`). |
| `vite.config.ts` | Configuración de Vite (alias `@` → `src`, Tailwind y React). |
| `tsconfig*.json` · `eslint.config.js` | Reglas de TypeScript y de lint. |
| `.env.example` | Variables de entorno de ejemplo: `VITE_API_BASE_URL` y `VITE_WS_URL`. |
| `docs/CONVENTIONS.md` | Reglas de estructura, nombres, comentarios y estilos. |
| `docs/INFORME-ESTRUCTURA.md` | Informe de la validación final. |
| `docs/ESTRUCTURA.md` | Este documento. |
