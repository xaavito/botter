const { saveToFacturacion, launchBrowser } = require('../helpers/helper.js')
const { esperarNuevaPestana } = require('../helpers/waitHelpers.js')
const logger = require('../helpers/logger.js')


const { login } = require('../pages/login.js')
const { verTodos } = require('../pages/ver_todos.js')
const { comprobantesEnLinea } = require('../pages/comprobantes_en_linea.js')
const { miPagina } = require('../pages/mi_pagina.js')
const { consultas } = require('../pages/consultas.js')
const { seleccionarFechaDesde } = require('../pages/seleccionar_fecha_desde.js')
const { buscar } = require('../pages/buscar.js')
const { iterarTablaJig } = require('../pages/iterar_tabla.js')

const { menuPrincipal } = require('../pages/menu_principal.js')

/**
 * Descarga facturas desde el portal de AFIP y las guarda en CSV
 * @returns {Promise<void>}
 * @throws {Error} Si falla la autenticación o descarga
 */
async function listarOnline() {
  let browser
  let resultados = []

  try {
    // disable headless to see the browser's action
    browser = await launchBrowser()
    const context = await browser.newContext({ acceptDownloads: true })
    const page = await context.newPage()

    await page.setDefaultNavigationTimeout(0)

    await login(page)

    await verTodos(page)

    await comprobantesEnLinea(page)

    const facturadorPage = await esperarNuevaPestana(context)


    await miPagina(facturadorPage)

    await consultas(facturadorPage)

    await seleccionarFechaDesde(facturadorPage)

    await buscar(facturadorPage)

    resultados = await iterarTablaJig(facturadorPage)

    saveToFacturacion(resultados)

    await facturadorPage.waitForTimeout(1000)

    await menuPrincipal(facturadorPage)

    return resultados
  } catch (error) {
    logger.error('Error listando facturas online:', error)
    throw error
  } finally {
    if (browser) {
      await browser
        .close()
        .catch((err) => logger.error('Error cerrando browser:', err))
    }
  }
}

module.exports = { listarOnline }
