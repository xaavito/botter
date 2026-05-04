export const GENERAR = 'Generar factura random'
export const GENERAR_MAS = 'Generar muchas'
export const GENERAR_NOMINADA = 'Generar Factura Nominada'
export const GENERAR_FACTURA_EXPORTACION = 'Generar Factura De Exportacion'
export const LISTAR = 'listar facturas realizadas a la fecha'
export const FACTURACION_MENSUAL = 'Ver Facturacion Mensual'
export const FACTURACION_ANUAL = 'Ver Facturacion Anual'
export const FACTURACION_ANUAL_ANTERIOR = 'Ver Facturacion Anual Año anterior'
export const DESCARGAR_FACTURACION_ANUAL = 'Descargar Facturacion Anual de AFIP'
export const INSERTAR_USUARIO = 'Insertar Usuario'
export const EXCEL = 'Excel'

// Timeouts optimizados por tipo de acción
export const TIMEOUT_CLICK = 400      // Para clicks simples (botones, enlaces)
export const TIMEOUT_FILL = 300       // Para llenar campos de formulario
export const TIMEOUT_NAVIGATION = 800 // Para cambios de página/navegación

// Mantener TIMEOUT para retrocompatibilidad (usar TIMEOUT_NAVIGATION por defecto)
export const TIMEOUT = TIMEOUT_NAVIGATION
