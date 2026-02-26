const { dateFormatted, saveToCSV, launchBrowser } = require('../helpers/helper.js')
const logger = require('../helpers/logger.js')

const { login } = require('../pages/login.js')
const { verTodos } = require('../pages/ver_todos.js')
const { comprobantesEnLinea } = require('../pages/comprobantes_en_linea.js')
const { generarComprobantes } = require('../pages/generar_comprobantes.js')
const { seleccionarPuntoVenta, seleccionarEmpresa } = require('../pages/seleccionar_pto_vta.js')

const { continuar } = require('../pages/continuar.js')
const { cargarConcepto } = require('../pages/cargar_concepto.js')
const { cargarIVAReceptor } = require('../pages/cargar_iva_receptor.js')
const { cargarItemFactura } = require('../pages/cargar_item_factura.js')
const { confirmar } = require('../pages/confirmar.js')
const { confirmarDialogo } = require('../pages/confirmarDialogo.js')
const { imprimirFactura } = require('../pages/imprimir_factura.js')
const { menuPrincipal } = require('../pages/menu_principal.js')

/**
 * Genera facturas en AFIP mediante automatización de browser
 * @param {Object} options - Opciones de generación
 * @param {number} [options.cantidad=1] - Cantidad de facturas a generar
 * @param {Object|null} [options.datos=null] - Datos específicos para factura nominada
 * @param {string} [options.datos.cuitEmisor] - CUIT del emisor
 * @param {string} [options.datos.password] - Contraseña del emisor
 * @param {string} [options.datos.user] - CUIT del receptor
 * @param {string} [options.datos.amount] - Monto de la factura
 * @param {string} [options.datos.modoPago] - Modo de pago
 * @param {string} [options.datos.tipoFactura] - Tipo de factura
 * @param {string} [options.datos.descripcionItem] - Descripción del item
 * @param {string} [options.datos.ivaReceptor] - Condición IVA del receptor
 * @returns {Promise<Array<{detalle: string, valor: number, fecha: string}>>} Resultados de facturas generadas
 * @throws {Error} Si falla la autenticación o generación
 */
async function generar({ cantidad = 1, datos = null}) {
  let browser
  let resultados = []
  
  try {
    // disable headless to see the browser's action
    browser = await launchBrowser()
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()

  await page.setDefaultNavigationTimeout(0)

  await login(page, datos)

  await verTodos(page)

  await comprobantesEnLinea(page)

  let pages = await context.pages()
  const facturadorPage = pages[1]

  await seleccionarEmpresa(facturadorPage)

  for (let index = 1; index <= cantidad; index++) {
    await generarComprobantes(facturadorPage)

    await seleccionarPuntoVenta(facturadorPage)

    await continuar(facturadorPage)

    await cargarConcepto(facturadorPage, datos)

    await cargarIVAReceptor(facturadorPage, datos)

    const itemsFactura = await cargarItemFactura(
      facturadorPage,
      datos
    )

    resultados.push({
      detalle: itemsFactura.detalle,
      valor: itemsFactura.valor,
      fecha: dateFormatted(),
    })

    await confirmar(facturadorPage)

    await confirmarDialogo(facturadorPage)

    await imprimirFactura(facturadorPage, datos)

    saveToCSV(datos, dateFormatted(), itemsFactura.detalle, itemsFactura.valor)

    await facturadorPage.waitForTimeout(1000)

    await menuPrincipal(facturadorPage)
  }

  return resultados
  } catch (error) {
    logger.error('Error generando facturas:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close().catch(err => 
        logger.error('Error cerrando browser:', err)
      )
    }
  }
}

module.exports = { generar }
