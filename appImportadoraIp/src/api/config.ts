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
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    // Productos, búsqueda e inventario de lectura
    PRODUCTS: {
      LIST: '/products',
      REGISTER: '/products/register',
      SEARCH: '/inventory/search',
      FILTER: '/inventory/filter',
      CONTROL: '/inventory/control',
      CREATE: '/inventory/createProduct',
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
    // Reportes
    REPORTS: {
      SALES: '/reports/sales',
      CUSTOMERS: '/reports/customers',
      FINANCIAL: '/reports/financial',
      INVENTORY: '/reports/inventory',
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
