# GestionImportadora
# GestionImportadora
ciclo de sesión (inactividad, renovación, cierre real y confirmación)

No apliqué nada. Este plan está escrito para que Antigravity lo ejecute sin más contexto.

0. Reglas que Antigravity debe respetar
No usar git: nada de commits, ramas ni stash. El respaldo lo hace el usuario.
No crear carpetas nuevas en la raíz de src. Las subcarpetas nuevas van solo dentro de global/ o de features/auth/.
No tocar global2/ ni features2/.
No borrar código comentado.
El código va en inglés. Los comentarios y los textos al cliente van en español.
Cada archivo lleva una cabecera de 2 líneas: // nombre · qué hace y // conecta con: ….
Cada .tsx lleva su .css al lado, con el mismo nombre y usando solo tokens de src/styles/tokens.css.
Cada archivo debe tener menos de 150 líneas y una sola responsabilidad.
Una carpeta no debe pasar de unos 8 archivos. Si pasa, se agrupa en subcarpetas por función.
Capas: app → features → global → api. Dentro de una feature: types → constants → helpers → services/selectors → slices → thunks → hooks → components → screens. Entre features se importa solo por index.ts. features y global no importan código de ejecución desde app/.
Nunca probar con credenciales reales. Usar red simulada, parcheando XMLHttpRequest y WebSocket en el navegador.
1. Lo que dice el backend
POST /auth/refresh recibe { "refresh_token": "..." } (modelo RefreshTokenRequest). Devuelve { success, data } con la forma de LoginResponse: access_token, refresh_token y user.
POST /auth/logout necesita el header Authorization: Bearer. No lleva body y responde 204. Revoca todos los refresh tokens del usuario.
El Swagger no documenta cuánto duran los tokens. Por eso el código no debe fijar una duración. Debe leer exp del payload del JWT.
2. Pasos en orden
Paso 1 · Configuración del API
Archivo: src/api/config.ts.
Cambio: en ENDPOINTS.AUTH añadir LOGOUT: '/auth/logout'.
Paso 2 · Almacenamiento de sesión
Archivo: src/global/helpers/session.storage.ts.
Nueva función: updateTokens(accessToken: string, refreshToken: string | null): void.
Debe escribir en el mismo almacén que ya guarda la sesión: localStorage si access_token está ahí, si no sessionStorage.
Así se respeta la opción “recordarme” y nunca se mueve la sesión de un almacén a otro.
Todo va dentro del safe (try/catch) que ya existe.
Opcional: getSessionStorageKind(): 'local' | 'session' | null, si ayuda a la función anterior.
Paso 3 · Constantes
Archivo nuevo: src/features/auth/constants/auth.session.constants.ts.
export const SESSION_TIMING = {
  INACTIVITY_LIMIT_MS: 3 * 60 * 1000,  // 3 minutos sin actividad
  WARNING_BEFORE_MS: 30 * 1000,        // aviso opcional antes de cerrar
  REFRESH_MARGIN_MS: 60 * 1000,        // renovar 60 s antes de que venza el token
  ACTIVITY_THROTTLE_MS: 1000,          // no registrar actividad más de 1 vez por segundo
  TICK_MS: 5000,                       // revisión periódica
} as const
export const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const
Archivo existente: auth.constants.ts, en LOGIN_MESSAGES. Añadir los textos al cliente:
inactiveTitle: 'Sesión cerrada por inactividad'
inactiveDescription: 'Pasaron 3 minutos sin actividad. Ingresa de nuevo para continuar.'
logoutTitle: 'Sesión cerrada'
warningTitle: 'Tu sesión está por cerrarse'
warningDescription: 'Mueve el mouse o toca una tecla para seguir conectado.'
Nuevo objeto LOGOUT_CONFIRM_TEXTS:
title: '¿Cerrar sesión?'
description: 'Se cerrará tu sesión en este equipo y se revocará el acceso.'
confirm: 'Cerrar sesión'
cancel: 'Cancelar'
Paso 4 · Helper del token
Archivo nuevo: src/features/auth/helpers/auth.token.ts.
Funciones:
decodeJwtExp(token: string): number | null. Parte el token en ., decodifica el payload en base64url (cambia -/_ y añade el relleno =), hace JSON.parse y devuelve exp * 1000 en milisegundos. Si algo falla devuelve null; nunca debe lanzar error.
msUntilExpiry(token: string, now = Date.now()): number | null.
shouldRefresh(token: string, marginMs: number, now?: number): boolean. Es true cuando falta marginMs o menos para el vencimiento.
Si exp es null: no se renueva por tiempo. Solo funciona la inactividad y el 401.
Paso 5 · Tipos
Archivo: src/features/auth/types/auth.types.ts.
Añadir: type LogoutReason = 'manual' | 'inactivity' | 'expired'.
Para refresh: reutilizar el tipo de respuesta del login (AuthResponse).
Paso 6 · Servicios
Archivo: src/features/auth/services/auth.service.ts.
Añadir:
export const refreshRequest = async (refreshToken: string): Promise<AuthResponse> => {
  const { data } = await apiClient.post<APIResponse<AuthResponse>>(
    API_CONFIG.ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken })
  return data.data
}
export const logoutRequest = async (): Promise<void> => {
  await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)   // 204, sin body
}
Paso 7 · Cliente HTTP
Archivo: src/api/client.ts.
En el interceptor de respuesta, el handler de 401 hoy se salta solo /auth/login. Debe saltarse también /auth/refresh y /auth/logout. Si no, una falla al renovar o al cerrar provoca un bucle de cierres de sesión.
Opcional, solo si no complica: ante un 401 en una ruta normal, intentar una renovación y reintentar la petición una vez. Para eso:
Guardar una única promesa de refresh en vuelo, para que las llamadas concurrentes esperen la misma.
Marcar la petición reintentada con una bandera para que no entre en bucle.
Si el refresh falla, llamar al unauthorizedHandler.
Capas: api no puede importar de features. El refresh real debe inyectarse con algo como setRefreshHandler(fn), igual que ya se hace con setUnauthorizedHandler.
Paso 8 · Thunks
Archivo: src/features/auth/thunks/auth.thunks.ts (puede partirse en auth.thunks.ts y auth.session.thunks.ts si pasa de 150 líneas).
logoutThunk pasa a recibir LogoutReason (por defecto 'manual'). El orden importa:
Si hay token, llamar logoutRequest() dentro de un try/catch. Si falla (red, 401, lo que sea), se ignora.
Siempre ejecutar clearAuthSession().
Según la razón, mostrar el toast: inactivity usa inactiveTitle y inactiveDescription, expired usa expiredTitle, manual usa logoutTitle.
Mostrar el toast dentro del thunk, o en el hook que lo despacha. Solo en un lugar, para que no salga duplicado.
Orden clave: el logout contra el servidor debe ir antes de borrar los tokens locales. Con el token ya borrado, la petición saldría sin Authorization y el servidor devolvería 401 sin revocar nada.
refreshSessionThunk:
Leer readSession().
Si no hay refreshToken, rechazar.
Llamar refreshRequest.
Guardar el par nuevo con updateTokens(access, refresh) y actualizar el usuario si viene.
Si falla, despachar logoutThunk('expired').
El servidor puede rotar el refresh token. Por eso siempre hay que guardar el que llega en la respuesta, no reutilizar el anterior.
Para que dos pestañas no se pisen: leer el refresh token justo antes de llamar, y no mantener copias en memoria.
Paso 9 · Slice y store
auth.slice.ts: logoutThunk.fulfilled se mantiene y el estado vuelve a anonymous. Añadir logoutThunk.rejected con el mismo efecto, por seguridad.
store.ts: el setUnauthorizedHandler hoy despacha logoutThunk() y muestra su propio toast. Cambiarlo a store.dispatch(logoutThunk('expired')) y quitar el toast de ahí, para que no salga dos veces.
Paso 10 · Hook de actividad
Archivo nuevo: src/features/auth/hooks/useSessionActivity.ts. Si pasa de 150 líneas, partirlo en dos hooks: uno para el seguimiento de actividad y otro para la renovación.
Comportamiento:
Una referencia lastActivityRef = Date.now(). Los eventos de ACTIVITY_EVENTS en window la actualizan (con un throttle de 1 s). Los listeners llevan { passive: true } y se quitan en el cleanup.
Un setInterval cada TICK_MS, con el siguiente flujo:
idle = now - lastActivity.
Si idle >= INACTIVITY_LIMIT_MS, despachar logoutThunk('inactivity') y parar.
Si idle >= LIMIT - WARNING_BEFORE_MS, mostrar una sola vez el aviso (con un toastId fijo). Cualquier actividad lo descarta.
Si hubo actividad reciente (idle < LIMIT) y shouldRefresh(accessToken, REFRESH_MARGIN_MS), despachar refreshSessionThunk(). Una bandera refreshingRef evita lanzar dos a la vez.
Con document.visibilitychange, al volver a la pestaña se evalúa de inmediato, porque los timers se frenan en segundo plano. Si ya pasaron más de 3 minutos, se cierra la sesión.
Condición de renovación: la renovación depende de que haya actividad dentro de la ventana de 3 minutos. Sin actividad no se renueva, y la sesión se cierra.
Sincronización entre pestañas (recomendado): escuchar el evento storage sobre access_token. Si desaparece en otra pestaña, hacer logout local. Esto solo cubre pestañas con localStorage (sesión recordada).
Montaje: una sola vez en src/app/layout/ErpLayout.tsx, junto a useRealtime(). Como ErpLayout solo existe con sesión activa, el hook no corre en el login.
Export: añadir el hook a features/auth/index.ts.
Paso 11 · Confirmación de cierre
Archivos nuevos: src/global/components/UI/molecules/ConfirmDialog.tsx y ConfirmDialog.css. Si molecules pasa de 8 archivos, usar una subcarpeta confirm/.
Props: open, title, description, confirmLabel, cancelLabel, onConfirm, onCancel, y loading? (opcional).
Comportamiento:
role="alertdialog", aria-modal="true", aria-labelledby y aria-describedby.
Esc cancela (usar useEscapeKey de global/hooks).
Clic en el fondo cancela.
El foco inicial va al botón “Cancelar”. Es la opción segura, para que un Enter accidental no cierre la sesión.
El foco queda atrapado dentro del diálogo y, al cerrar, vuelve al botón que lo abrió.
Mientras está abierto, el contenido de atrás no debe recibir foco.
CSS: solo tokens (colores, radios, sombras, espaciado, movimiento). Una animación corta de entrada que respete prefers-reduced-motion. En móvil los botones pueden apilarse.
Cableado: src/app/componentApp/sideMenu/footer/SideMenuUser.tsx.
El botón de cerrar sesión deja de despachar directo. Abre el diálogo con un useState.
Al confirmar: dispatch(logoutThunk('manual')).
Es una excepción permitida, porque son confirmaciones de acciones, y no hace falta crear otro componente de app.
Mientras corre el logout: deshabilitar los botones (loading). El logout contra el servidor puede tardar hasta 15 s por el timeout de axios, y no debe poder pulsarse dos veces.
Paso 12 · Realtime
El socket se abre con el token en la URL (?token=). Tras una renovación, el socket abierto sigue con el token viejo.
Decisión pendiente: si el servidor valida el token de nuevo al reconectar, hay que reabrir el socket con el token nuevo después de cada refresh. Si no, basta con que la siguiente reconexión lea el token actual de readSession().
Al cerrar sesión ya se detiene solo, porque isAuthenticated pasa a falso. Verificar que no quede ningún socket abierto.
Paso 13 · Documentación
Actualizar docs/CONVENTIONS.md con una sección corta sobre el ciclo de sesión.
Regenerar docs/ESTRUCTURA.md con el script de generación, que lee las cabeceras de cada archivo.
Revisar que .env.example no necesite variables nuevas. Los tiempos van en constantes, no en variables de entorno.
3. Casos borde
Token sin exp o ilegible: no se renueva por tiempo. Solo aplican inactividad y 401.
Refresh falla (401 o red): logout con razón expired. Un error de red puntual no debería cerrar la sesión por sí solo; reintentar una vez antes de cerrar.
Varios refresh a la vez: una sola promesa en vuelo más la bandera refreshingRef.
Logout con el servidor caído: igual se limpia lo local y se informa. Solo hay que avisar que el servidor no pudo confirmar la revocación si falló.
“Recordarme” desmarcado: los tokens viven en sessionStorage. updateTokens debe escribir ahí, no en localStorage.
Computador dormido o pestaña en segundo plano: al volver se revisa con visibilitychange y con la comparación de timestamps, no con timers acumulados.
Dos pestañas: el logout revoca todos los refresh tokens del usuario, así que la otra pestaña se enterará con su siguiente 401 o por el evento storage.
Diálogo abierto durante la inactividad: el cierre por inactividad lo cierra y gana sobre la confirmación.
Ningún toast duplicado: usar un toastId por tipo.
4. Pruebas (red simulada, sin credenciales reales)

Para no esperar 3 minutos reales, probar con una constante de desarrollo reducida (por ejemplo 10 s) y devolverla a 3 * 60 * 1000 antes de terminar.

Inactividad: sesión simulada y sin mover el mouse. A los 3 minutos se cierra y se ve el toast de inactividad. Con actividad cada 2 minutos no se cierra.
Aviso: a los 2:30 sin actividad sale el aviso. Al mover el mouse desaparece.
Renovación: un JWT falso con exp a 90 s. Con actividad, a los ~30 s (exp menos 60 s) se hace POST /auth/refresh con {refresh_token}, se guardan los dos tokens nuevos en el mismo almacén y no hay toast. Sin actividad no se renueva y se cierra.
Logout manual: el botón abre la confirmación. “Cancelar” y Esc no hacen nada. “Cerrar sesión” hace POST /auth/logout con Authorization: Bearer, luego limpia el almacenamiento y vuelve al login.
Orden del logout: confirmar en la red simulada que la petición salió con el token puesto.
Logout con servidor caído: simular error 500 o red caída. La sesión local igual se cierra.
Sin bucles: un 401 en /auth/refresh o /auth/logout no vuelve a disparar el handler.
Foco y accesibilidad del diálogo: Tab no sale del diálogo, el foco inicial está en “Cancelar”, Esc cierra y el foco vuelve al botón.
Comprobaciones finales: npx tsc -b, npm run lint, npm run build, sin errores en consola, y la verificación de capas de siempre (0 violaciones, 0 ciclos).
5. Criterios de aceptación
La sesión se cierra tras 3 minutos sin actividad y solo en ese caso.
Con actividad continua, los tokens se renuevan solos sin que el usuario lo note.
Al cerrar sesión se llama POST /auth/logout y se borran todos los datos locales, incluso si el servidor falla.
Toda salida manual pasa por la confirmación.
No hay carpetas nuevas en la raíz de src, ni archivos de 150 líneas o más, ni código comentado borrado, y global2/ y features2/ siguen intactos.
Los textos al cliente están en español y los identificadores en inglés.
6. Decisiones que quedan abiertas
Duración real del token: hoy no la conocemos. El usuario puede confirmarla decodificando iat y exp en la consola. Si el access token dura menos de 3 minutos, la renovación será frecuente y conviene reducir REFRESH_MARGIN_MS.
Rotación del refresh token: el código ya guarda el que llega, así que funciona en ambos casos.
Aviso previo (30 s): lo incluí como opcional. Si no lo quieres, se quita WARNING_BEFORE_MS y su toast.
Eventos que cuentan como actividad: propuse mouse, teclado, scroll y toque. Se pueden ajustar en ACTIVITY_EVENTS.
Reintento automático tras un 401 normal: es opcional (Paso 7). Hoy solo se consumen login y health, así que no se nota hasta que haya más endpoints.


// config · URL base, timeout y endpoints del backend
// conecta con: api/client, api/health; scripts/check-endpoints.mjs revisa que cada ruta exista en el Swagger (npm run check:api)
// ojo: aquí viven TODAS las rutas (ninguna escrita suelta en un service). Todos los listados del backend son POST con { companyId, page, pageSize, ... } y responden { data, meta }
// src/api/config.ts

/**
 * Configuración maestra de la API (Backend en Railway)
 */
export const API_CONFIG = {
  BASE_URL:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
    'https://importadora-back-production.up.railway.app',
  TIMEOUT: 15000, // 15 segundos
  // URL del websocket de tiempo real; vacía = tiempo real desactivado (no se conecta a ningún servidor por defecto)
  WS_URL: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_URL) || '',
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/login', //funciona 
    
      REFRESH: '/auth/refresh', //funciona
      LOGOUT: '/auth/logout',//funciona, debemos validar que el token se revoque completametne y que la logica detras lo deje invalido al aplicar el logout
      
    },
    // Productos, búsqueda e inventario de lectura
    PRODUCTS: {
      LIST: '/products',
      REGISTER: '/products/register',
    },
    // Búsqueda universal (varias entidades a la vez)
    SEARCH: {
      UNIVERSAL: '/search',
    },
    // POS / Carrito de Ventas
    CARTS: {

      GET: '/carts', //se le envia POST CON BODY VACIO Y SE OBTIENE UNA RESPUESTA 200 PERO SIN DATA
      //VALIDAR QUE DATA SI ESTE ENVIANDOSE EN LA RESPUESTA DESDE EL BACKEND
      //COMO NO DEVUELVE DATA, NO E ACCEDIDO A LOS uuid de los demas carritos
      REGISTER_ITEM: '/carts/register', //DEVUELVE RESPUETSA 200 OK,"CREA" EL CARRITO, ENVIANDO 
      UPDATE: '/carts/update', // cambia la cantidad de un ítem { cartId, quantity }
      DELETE: '/carts/delete', // borra un ítem y devuelve su stock { cartId }
      DELETE_ALL: '/carts/deleteall', //DELETE MASIVO envia user id e identificador unico de el carrito "uuid"
      REASSIGN_USER: '/carts/reassignuser', //responde correctametne, se envia  con {"newUserId","oldUserId", "uuid"
    },
    // Catálogos grupo base de el endpoint
    CATALOGS: {
      CATEGORIES: '/categories', //FUNCIONA-DEBE LLEVAR companyID, page, pagezise, y devuelve un 200 con todas las categorias
      CATEGORIES_REGISTER: '/categories/register', //funciona devuelve el categorieId junto con el mensaje de success 200 OK
      CATEGORIES_UPDATE: '/categories/update',// ENVIA UN ERROR DE EL SERVIDOR AL ENVIAR LA PETICION, NO ACTUALIZA, SE ENVIAN 
      //"categoryId","name"
      BRANDS: '/brands',
      BRANDS_REGISTER: '/brands/register',
      BRANDS_UPDATE: '/brands/update',
      //      MODELS: '/models',
      //      MODELS_REGISTER: '/models/register',
      //      MODELS_UPDATE: '/models/update',
      WAREHOUSES: '/warehouses',
      WAREHOUSES_REGISTER: '/warehouses/register',
      WAREHOUSES_UPDATE: '/warehouses/update',
    },

    MODELS: {
      MODELS: '/models', //FUNCIOAN CORRECTAMENTE DEVUELVE OBJETOS DENTRO DE MODEL, MODELID, NAME
      MODELS_REGISTER: '/models/register', //FUNCIONA CORRECTAMENTE, SE CREA EL MODELO CON LOS MISMOS CAMPOS MODELID, NAME
      MODELS_UPDATE: '/models/update', //FUNCIONA, SE RECIBE RESPUESTA 200, PERO NO PUDE VER EL PRODUCTO CREADO CON LOS DATOSW E PRUENA
    },
    // Terceros: usuarios (clientes y vendedores, proveedores, TODOS los Agentes activos son ), centralizada de la imfo de cada actor
    USERS: {
      LIST: '/users',
      BY_ID: (id: number | string) => `/users/${id}`,
      REGISTER: '/users/register',
      QUICK_REGISTER: '/users/quick-register',
      UPDATE: '/users/update',
      STATE: '/users/state',
      VALIDATE_DOCUMENT: '/users/validate-document',
      BALANCE: '/users/balance',
      CREDIT: '/users/credit',
      CREDIT_DAYS: '/users/credit/days',
      CREDIT_LIMIT: '/users/credit/limit',
    },
    CUSTOMERS: {
      REGISTER: '/customers/register',//    envia en el body elegimos from data, e ingresamos dentro data:
      // datos de el cliente, y ingresamos los demas archivos enviandolos en null, la tabla no esta creada,
      // falta migrar para que se cree o no esta completa 
      CHECK_EMAIL: '/customers/check-email', //SE ENVIA EN EL BODY EL companyid e email de el usario, se obtiene:  (200) SI FUNCIONA 
      FAVORITES: '/customers/favorites', // TABLA user.favorites no existe, no esta en la db o falta la migracion para ingresarla, validar
      UPDATE_FAVORITE: '/customers/update-favorite',//no existe la tabla en la db "error": "Error updating favorite: Error 1146 (42S02): Table 'testpremium.userfavorites' doesn't exist" 
      UPDATE_DETAILS: '/customers/update-details', //error": "Error updating details: Error 1146 (42S02): Table 'testpremium.userdetails' doesn't exist
      UPDATE_COMPANIES: '/customers/update-companies', // falta la integracion de la colunma de tipod de documento dentro de la db, por eso no pasa a 200 la peticion
      UPDATE_PHOTO: '/customers/update-photo',//validar que la tabla este alineada con lo que actualmetne requiere el form, indica "{
      // 	"success": false,
      // 	"message": "Solicitud inválida",
      // 	"error": "Photo file is required" aun enviando imagen falsa con libreia faker
      // }"
      UPDATE_DOCUMENT: '/customers/update-document',//runtime error: invalid memory address or nil pointer dereference, en el form se envia claves: photo, photos y no funciona, se envia la calve "files" e indica  "runtime error: invalid memory address or nil pointer dereference"
      DELETE_DOCUMENT: '/customers/delete-document', // SE  envia companyId con userId y responde con un 500: 
      // 	"success": false,
      // 	"message": "Error interno del servidor",
      // 	"error": "Error deleting document: file not found"
      // }, validar si dentro de el ususario no cuenta con documetos cargados
    },
    DIRECTIONS: {
      LIST: '/directions',//FUNCIOAN SIN ERROR ENVIANDO BODY CON userid page, pagesize  pagezise es la cantidad de objeton que va a traer
      //page es el indicador de a que page ir a buiscar el dato que estamos enviando, pagesize indica la cantidad dentro que se van a msotrar que consinidan con el id 
      REGISTER: '/directions/register', //funciona sin errroes agregando la direccion a el ususario, se envia 
      //{
      //   "additionalInfo": "CASA DE PRUEBA SEGUNDO PISO",
      //   "address": "CALLE DE PRUEBA ANDRES",
      //   "city": "CARRERA DE PRUEBA",
      //   "country": "pOLOMBIA",
      //   "department": "SEGUNDO PISO",
      //   "neighborhood": "SANTO DOMINGO",
      //   "userId   315
      // }  
      UPDATE: '/directions/update',//FUNCIONA CORRECTAMENTE ACTUALIZA,
      // SE LE ENVIA EL BODY CON DIRECTIONID PARA DAR CON LA DIRECCION REGISTRADA 
      // QUE SE VA A ACTUALIZAR CON EL MISMO BODY
      DELETE: '/directions/delete', //FUNCIOAN CORRECTAMETE, PRUEBA APLICADA CONTRA EL DIRECTIONID "1120" SE ELIMINO CORRECTAMETNE LA DIRECCION "//       
      // "message": "Direction deleted successfull" 
    },
    DISCOUNTS: {
      LIST: '/discounts',  //SI FUNCIONA, DA UNA RESPUESTA, VALIDAR SI LOS DATOS QUE SE DEBEN ENVIAR DE LOS DESCUENTOS SI ESTEN DENTRO DE EL CAMPO AL LLAMARLOS
      REGISTER: '/discounts/register', //Funciona, crea el modelo correctamente con body modelId, name (name como string,pero contiene datos numericos)
      UPDATE: '/discounts/update',
      DELETE: '/discounts/delete',
      DELETE_ALL: '/discounts/deleteall',
      DISABLE_ALL: '/discounts/disabledall',
    },
    // Cartera y Crédito
    WALLET: {
      BASE: '/wallet',
      SUMMARY: '/wallet/summary',
      INTERNAL: '/wallet/internal',
      HISTORY: '/wallet/history',
    },
    PAYMENTS: {
      LIST: '/payments',
      REGISTER: '/payments/register',
      ADVANCE: '/payments/advance',
      EARLY: '/payments/early',
      BY_SALE: '/payments/by-sale',
      DETAIL: '/payments/detail',
      SUMMARY: '/payments/summary',
      CHANGE_STATUS: '/payments/changestatus',
      CANCELLED: '/payments/cancelled',
    },
    // Ventas y Pipeline de Surtido
    SALES: {
      REGISTER: '/sales/register',
      PENDINGS: '/sales/pendings',
      HISTORY: '/sales/history',
      DETAIL: '/sales/detail',
      SUMMARY: '/sales/summary',
      STATUS: '/sales/status',
      CANCEL: '/sales/cancel',
      APPROVED: '/sales/approved',
      TRASLADES: '/sales/traslades',
      TRASLADES_REJECT: '/sales/traslades/reject',
      REPORT_GENERAL: '/sales/report/general',
      REPORT_INTERNAL: '/sales/report/internal',
    },
    ORDERS: {
      LIST: '/orders',
    },
    COMPANIES: {
      LIST: '/companies', //GET COMPANIES
      CREATE: '/companies',
      UPDATE: '/companies/update', //PUT  data to update have to send  
      //   "address": "string",
      //   "businessName": "string",
      //   "dianResolutionDate": "string",
      //   "dianResolutionNumber": "string",
      //   "economicActivities": "string",
      //   "electronicCancellationSerial": "string",
      //   "email": "string",
      //   "finalInvoiceNumber": "string",
      //   "initialInvoiceNumber": "string",
      //   "isActive": true,
      //   "isElectronicBiller": true,
      //   "logo": "string",
      //   "name": "string",
      //   "nit": "string",
      //   "paymentSerial": "string",
      //   "phone": "string",
      //   "prefix": "string",
      //   "purchaseSerial": "string",
      //   "supplierNit": "string",
      //   "technicalKey": "string"
      // }
      DELETE: '/cpompanies/delete', //delete by Cományid devuelve la respuesta: {
      // "success": false,
      // "message": "Solicitud inválida",
      // "error": "Invalid company ID"
      // } ni con id ni con companyid
      // BY_ID: (id: number | string) => `/companies/${id}`, {
      // "success": false,
      // "message": "Solicitud inválida",
      // "error": "Invalid company ID"
      // }
    },
    INVENTORY: {
      GET: '/inventory',
      //FUNCIONA devuelve  el inventario de la empresa, MENSAJE SUCCES 200  "Products successfully obtained"
      CONTROL: '/inventory/control', //FUNCIONA OBTENEMOS RESPUESTA 200 DEVUELVE DATOS DE EL PRODUCTO IDPRODUCTO CODDIGO Y DATA CON LA INF DE EL PRODUCT 
      COUNT_LOCATIONS: '/inventory/countLocations', // fUNCIONA DEVUELVE UNA RESPUESTA SIMPLE 

      CREATE_PRODUCT_INVENTORY: '/inventory/createProduct', // DEVUELVE la respuesta sencilla  el body enviado en complejo:
      //       {
      //   "brandId": 30,
      //   "categoryId": 63,
      //   "code": "P0001",
      //   "companyId": 1,
      //   "description": "prueba de andres description",
      //   "isActive": true,
      //   "lastCost": 18000,
      //   "maxStock": 50,
      //   "minStock": 5,
      //   "modelId": 1,
      //   "purchasePrice": 18000,
      //   "taxId": 1
      //      pero el producto no se crea, no se sabe error sobre la tabla,
      //  o sobre la documentacion que indica enviar datos incompletos o desobra
      DELETE: '/inventory/deleteLocationProduct', //FUNCIONA enviamos udserId, prodiuctoLocationId, y companyId
      //SE OBTIENE RESPUESTA 200 CON  Y ARREGLOS COMO:  MOVEMENT, CONTROL Y PRODUCTLOCATION 
      //
      FILTER: '/inventory/filter', //funciona enviandole un body con miltiples arrays
      //       {
      //   "brandIds": [
      //     30
      //   ],
      //   "categoryIds": [
      //     63
      //   ],
      //   "companyId": 1,
      //   "familyIds": [],
      //   "hasStock": true,
      //   "modelIds": [
      //     1
      //   ],
      //   "page": 1,
      //   "pageSize": 30,
      //   "statusId": [
      //     2,
      //     3,
      //     7
      //   ],
      //   "warehouseId": 1
      // } devuelve la respuesta sin data, validar si el backend si envia la data correctamente en la respuesta 
      LOCATIONS: '/inventory/locations', // FUNCIONA SE ENVIA Y OBTENEMOS RESP 200 CON MENSAJE Y DATA, DENTRO DE DATA ENCONTRAMOS OJETOS:
      //"locationId": 8,
      // 	"warehouseId": 1,
      // 	"companyId": 1,
      // 	"location": "01-A700",
      // 	"isActive": 1,
      // 	"created_at": "2025-07-25T14:06:55Z",
      // 	"update_at": "2026-03-10T10:09:18Z",
      // 	"countProducts": 6,
      // 	"countItems": 20
      // },
      // {
      // 	"locationId": 9,
      // 	"warehouseId": 1,
      // 	"companyId": 1,
      // 	"location": "01-B00",
      // 	"isActive": 1,
      // 	"created_at": "2025-07-25T14:06:55Z",
      // 	"update_at": "2025-11-06T14:18:35Z",
      // 	"countProducts": 3,
      // 	"countItems": 1
      // }
      // Reportes
      REGISTER_LOCATION: '/inventory/registerLocation', // FUNCIONA devuelve una respuetsa 
      // "Error interno del servidor" pero la accion no registra la nueva ubicacion, validar el controlador de el backend esta completo en su logica
      REGITER_PRODUCT_LOCATION: '/inventory/registerProductLocation', //se envia en body:
      //  "companyId": 1,
      //  "location": "01-b1000",
      //  "productId": 13482,
      //  "quantity": 10,
      //  "userId": 315,
      //  "warehouseId": 1
      //pero la respuetsa indica un error de el backend en la peticion
      SEARCH: '/inventory/search', //FUNCIONA, se envian {
      //   "companyId": 1,
      //   "limit": 5,
      //   "query": "17020420",
      //   "type": "product"
      // } pero el campo limit no influye en nada, el campo importante es "query"
      SEARCH_LOCATION: '/inventory/searchLocation', //   ENVIAMOS {
      //   "companyId": 1,
      //   "location": "A1-700",
      //   "warehouseId": 1
      // } obtendremos   {    PERO DEVUELVE LA RESPUESTA CON DATA TIPO NULL    
      TRANSFER_LOCATION: '/inventory/transferLocationProduct', //   
      //       {
      //   "companyId": 1,
      //   "destinationLocation": "01-A7001",
      //   "eliminate": "false",
      //   "originLocation": "01-A700",
      //   "productId": 13482,
      //   "quantity": 2,
      //   "userId": 1023,
      //   "warehouseId": 1
      // } pero en respueta indica error en el servidor "{
      //   "success": false,
      //   "message": "Error interno del servidor",
      //   "error": "Error: failed detected ProductLocationId in Location Origin"
      // }
      NAVIGATE_BY_LOCATIONS: "/inventory/turn360degree", //se envia companyId ubicacion nueva, ubicacion actual productId
      //se envia  y la respesta obtenida es un error interno "no get de locations de el producto" 
      UPDATE_LOCATION: '/inventory/updateLocation', // se envian
      //   "companyId": 1,
      //   "location": "06-D06",
      //   "locationId": 13,
      //   "warehouseId": 1
      // pero la respuesta indica un error interno de el servidor 
      // Error: failed to location exist

      UPDATE_LOCATION_PRODUCT: '/inventory/updateLocationProduct', // se envia en body
      //   {
      //   "companyId": 1,
      //   "location": "01-B00",
      //   "locationId": 13,
      //   "warehouseId": 1
      // } pero como respuesta se optiene que la ruta de el endpoint no existe, dos opciones, ruta erronea:  
      // https://importadora-back-production.up.railway.app/inventory/updateLocationProduct

      REPORTS: {
        SALES: '/reports/sales',
        CUSTOMERS: '/reports/customers',
        FINANCIAL: '/reports/financial',
      },
      // Empleados y Permisos
      EMPLOYEES: {
        BASE: '/employees', //GET GENERAL DE LOS DATOS OBTIENE   "success": true,"message": "Employees retrieved successfully","data" [ARRAY DE LA DATA QUE CONTEIEN  DENTRO DE ESTA RESPUESTA OTIENE ]
        //   "userId": 1009,
        // 	"employeeId": 43,
        // 	"branches": [
        // 		{
        // 			"branchId": 1,
        // 			"branchName": "Updated Warehouse"
        // 		},
        // 		{
        // 			"branchId": 6,
        // 			"branchName": "Tienda Online"
        // 		}
        // 	],
        // 	"roles": [
        // 		{
        // 			"roleId": 1,
        // 			"roleName": "Vendedor interno"
        // 		},
        // 		{
        // 			"roleId": 4,
        // 			"roleName": "Bodeguero"
        // 		}
        // 	],
        // 	"workModality": "Presencial",
        // 	"inmediateSupervisor": {
        // 		"name": ""
        // 	},
        // 	"employmentStatus": "activo",
        // 	"companyId": 1,
        // 	"warehouseId": 0,
        // 	"photo": "https://pub-85f7794f845a4ff6bd279426e93ab5ef.r2.dev/empleados/fotos/images-1762743280.png",
        // 	"companyDetails": {
        // 		"businessName": "",
        // 		"nit": "",
        // 		"phone": "",
        // 		"cellPhone": ""
        // 	},
        // 	"name": "rfwefwe",
        // 	"lastName": "fwefwf",
        // 	"identification": "313231323121",
        // 	"country": "Colombia",
        // 	"department": "Antioquia",
        // 	"city": "Medellín",
        // 	"neighborhood": "",
        // 	"address": "dqdw, Medellín Antioquia",
        // 	"additionalInfo": "",
        // 	"dni": "313231323121",
        // 	"email": "updated+43@example.com",
        // 	"phone": "123123231",
        // 	"isActive": true
        // },
        LIST: '/employees/list', //GET QUE OBTIENE LA LISTA DE LOS EMPLEADO COMPLETA: {
        // "success": true,
        // "message": "Employee list retrieved successfully",
        // // "data": { DENTRO DE DATA OBTENEOMOS EL ARRAY DE LAS FILAS DE EL EMPLADOC CON  "employees": [
        // {
        // 	"employeeId": 55,
        // 	"userId": 1023,
        // 	"name": "Juan Sebastian",
        // 	"lastName": "Grisales",
        // 	"businessName": "Importadora Premium Online S.A.S",
        // 	"accessStatus": true,
        // 	"connectionStatus": {
        // 		"lastConnectedAt": "",
        // 		"connectedDurationSeconds": 0
        // 	},
        // 	"identification": "334343",
        // 	"identificationType": "CC",
        // 	"email": "juansebastian.grisales@premiummotos.com",
        // 	"phone": "34343434",
        // 	"photo": "",
        // 	"employmentStatus": "activo",
        // 	"workModality": "Presencial"
        // },

        ROLES: '/employees/roles', //funciona, enviando en companyId como parametro e id de le empresa "1" y devuelve 
        //devuelve mensaje data y succes y muestra la respuesta: con las areasid de estas y roles de el area
        // "areaId": 3,
        // "areaName": "Administración",
        // "areaIcon": "briefcase",
        // "roles": [
        // 	{
        // 		"roleId": 3,
        // 		"roleName": "Administrador",
        // 		"description": "Administra operaciones generales",
        // 		"permissions": [],
        // 		"assignable": true,
        // 		"usersCount": 6
        // 	}
        // ]
        PERMISSIONS: '/employees/permissions',//requiero envio de el campo de  {"employeeId": 46} y devuelve una respuesta de no acceso o acceso denegado  
        //{
        // 	"success": false,
        // 	"message": "Access denied",   
        // 	"error": "employee not found or access denied"
        // }  aun cuando el id de empleado no coincide 
        // envia :
        // {  
        // 	"success": true,
        // 	"message": "Employee permissions retrieved successfully",
        // 	"data": {
        // 		"employeeId": 46,
        // 		"name": "werfwefwe",
        // 		"lastName": "ewfwf",
        // 		"branches": [
        // 			{
        // 				"branchId": 1,
        // 				"branchName": "Updated Warehouse",
        // 				"isPrimary": false
        // 			},
        // 			{
        // 				"branchId": 4,
        // 				"branchName": "NLR",
        // 				"isPrimary": false
        // 			},
        // 			{
        // 				"branchId": 6,
        // 				"branchName": "Tienda Online",
        // 				"isPrimary": false
        // 			},
        // 			{
        // 				"branchId": 7,
        // 				"branchName": "Premiun Jac",
        // 				"isPrimary": false
        // 			}
        // 		],
        // 		"modules": []
        // 	}
        // }
        DELETE: '/employees/', //no funciona lña respuesta obtenida es "record not found"  y el empleado no se elimina exitosamente
        SAVE_PERMISSIONS: '/employees/permissions/modules', //envia el mismo employeeId obligarotio para identifiacr a que empleado se le actualizadron, dieron permisos de el endpoint anterior, y debe enviar en su body:
        //       {
        //   "employeeId": 0,
        //   "modules": [
        //     {
        //       "canCreate": true,
        //       "canDelete": true,
        //       "canRead": true,
        //       "canUpdate": true,
        //       "moduleId": 11,
        //       "moduleKey": "string",
        //       "screens": [
        //         {
        //           "canCreate": true,
        //           "canDelete": true,
        //           "canRead": true,
        //           "canUpdate": true,
        //           "screenId": 0
        //         }
        //       ]
        //     }
        //   ]
        // }

        CREDENTIALS: '/employees/access-credentials',
        BY_ROLE: '/employees/by-role',
        ROLE: '/employees/roles', //{
        // "companyId": 5
        // }

      },
      // Salud del backend (GET, sin sesión y muy liviano: unos 220 bytes)
      HEALTH: {
        CHECK: '/health', //se envia con GET sin body ni headers, se obtiene una respuesta que no indica mucho, "redis no esta confugurado
        READINESS: '/readiness',  //funciona, devuelve un tiempo de respuetsa
      },
      // Documentación Swagger (es el archivo del Swagger, no una ruta de la API; no lo consume la app)
      DOCS: {
        SWAGGER_DOC: '/swagger/doc.json',
      },
    },
  } as const

export default API_CONFIG
