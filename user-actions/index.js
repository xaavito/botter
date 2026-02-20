// Archivo central que exporta todas las acciones
const { generarAction } = require('./generar-action.js')
const { generarMasAction } = require('./generar-mas-action.js')
const { generarNominadaAction } = require('./generar-nominada-action.js')
const {
  generarFacturaExportacionAction,
} = require('./generar-factura-exportacion-action.js')
const { listarAction } = require('./listar-action.js')
const { facturacionMensual } = require('./facturacion-mensual-action.js')
const { facturacionAnual } = require('./facturacion-anual-action.js')
const {
  facturacionAnualAnterior,
} = require('./facturacion-anual-anterior-action.js')
const { facturacionOnlineAFIP } = require('./facturacion-online-afip-action.js')
const { insertarUsuarioAction } = require('./insertar-usuario-action.js')

// Importar constantes para el mapeo
const {
  GENERAR,
  GENERAR_MAS,
  GENERAR_NOMINADA,
  GENERAR_FACTURA_EXPORTACION,
  LISTAR,
  FACTURACION_MENSUAL,
  FACTURACION_ANUAL,
  FACTURACION_ANUAL_ANTERIOR,
  DESCARGAR_FACTURACION_ANUAL,
  INSERTAR_USUARIO,
} = require('../helpers/constants.js')

// Mapeo de acciones - cada acción tiene su función correspondiente
const actionMap = {
  [GENERAR]: generarAction,
  [GENERAR_MAS]: generarMasAction,
  [GENERAR_NOMINADA]: generarNominadaAction,
  [GENERAR_FACTURA_EXPORTACION]: generarFacturaExportacionAction,
  [LISTAR]: listarAction,
  [FACTURACION_MENSUAL]: facturacionMensual,
  [FACTURACION_ANUAL]: facturacionAnual,
  [FACTURACION_ANUAL_ANTERIOR]: facturacionAnualAnterior,
  [DESCARGAR_FACTURACION_ANUAL]: facturacionOnlineAFIP,
  [INSERTAR_USUARIO]: insertarUsuarioAction,
}

module.exports = {
  actionMap,
  // Exportar también las acciones individuales por si se necesitan
  generarAction,
  generarMasAction,
  generarNominadaAction,
  generarFacturaExportacionAction,
  listarAction,
  facturacionMensual,
  facturacionAnual,
  facturacionAnualAnterior,
  facturacionOnlineAFIP,
  insertarUsuarioAction,
}
