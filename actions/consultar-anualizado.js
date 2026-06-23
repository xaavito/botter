const {
  sanitizeNumber,
  getDatesfromOneYearBack,
  saveToCSV,
  launchBrowser,
} = require('../helpers/helper.js')

const { login } = require('../pages/login.js')
const { verTodos } = require('../pages/ver_todos.js')
const { misComprobantes } = require('../pages/mis_comprobantes.js')
const { emitidos } = require('../pages/emitidos.js')
const { consumidorFinal } = require('../pages/consumidor_final.js')
const { puntoVentaModal } = require('../pages/pto_vta_modal.js')
const { seleccionarFechas } = require('../pages/seleccionar_fechas.js')
const { obtenerValoresFacturas } = require('../pages/valores_facturas.js')
const { consultar } = require('../pages/consultar.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

const logger = require('../helpers/logger.js')

/**
 * Consulta y guarda facturación anual completa desde AFIP
 * @returns {Promise<void>}
 * @throws {Error} Si falla la consulta
 */
async function main() {
  let browser

  try {
    // disable headless to see the browser's action
    browser = await launchBrowser()
    const context = await browser.newContext({ acceptDownloads: true })
    const page = await context.newPage()

    await page.setDefaultNavigationTimeout(0)

    await login(page)

    await verTodos(page)

    await misComprobantes(page)

    let pages = await context.pages()
    const facturadorPage = pages[1]

    await emitidos(facturadorPage)

    await consumidorFinal(facturadorPage)

    await puntoVentaModal(facturadorPage)

    //REPETIR POR CADA FECHA
    const datesArr = getDatesfromOneYearBack()
    let totalAnual = 0
    // datesArr.forEach(async e => {
    for (const e of datesArr) {
      await seleccionarFechas(facturadorPage, e)

      const valores = await obtenerValoresFacturas(facturadorPage)

      const count = await valores.rowsAmounts.count()

      let valorFactura
      for (let i = 0; i < count; ++i) {
        valorFactura = sanitizeNumber(
          await valores.rowsAmounts.nth(i).textContent()
        )

        totalAnual += valorFactura
        saveToCSV(
          null,
          await valores.rowsDates.nth(i).textContent(),
          'sin detalle',
          valorFactura,
          'DetallesAnuales'
        )
      }
      await consultar(facturadorPage)
    }

    logger.info(
      `Total facturado desde ${datesArr[0].from} hasta ${
        datesArr.slice(-1)[0].to
      }: $${totalAnual}`
    )

    // ToDo downgrade next timeout
    await waitForTimeoutWithRetry(facturadorPage, 10000, null, 'Consultar Anualizado - Final')
  } catch (error) {
    logger.error('Error consultando facturación anual:', error)
    throw error
  } finally {
    if (browser) {
      await browser
        .close()
        .catch((err) => logger.error('Error cerrando browser:', err))
    }
  }
}
main()
