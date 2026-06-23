// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature
const {
  rounder,
  generateShortId,
  launchBrowser,
} = require('../helpers/helper.js')
const { login } = require('../pages/login.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')
const logger = require('../helpers/logger.js')

/**
 * Descarga facturas del mes actual desde AFIP
 * @returns {Promise<void>}
 * @throws {Error} Si falla la descarga
 */
async function main() {
  let browser

  try {
    const today = new Date()
    const dateAsString = `${today.getFullYear()}${rounder(today.getMonth() + 1)}`

    const firstDayOfThisMonth = `1/${rounder(
      today.getMonth() + 1
    )}/${today.getFullYear()}`
    // disable headless to see the browser's action
    const browser = await launchBrowser()
    const context = await browser.newContext({ acceptDownloads: true })
    const page = await context.newPage()

    const navigationPromise = page.waitForNavigation({
      waitUntil: 'domcontentloaded',
    })

    await login(page)

    await page.click('text=Comprobantes en línea')
    await waitForTimeoutWithRetry(page, 1000, null, 'Consultar - Comprobantes')

    let pages = await context.pages()
    const facturadorPage = pages[1]

    // Pagina
    await navigationPromise
    await facturadorPage.click(`input[value="${process.env.USER_NAME}"]`)

    // Acceder a Consultas
    await navigationPromise
    await facturadorPage.click('text=Consultas')
    await waitForTimeoutWithRetry(facturadorPage, 1000, null, 'Consultar - Consultas')
    // Search
    await navigationPromise
    await facturadorPage.fill(
      'input[name="fechaEmisionDesde"]',
      firstDayOfThisMonth
    )
    await facturadorPage.selectOption('select[name="idTipoComprobante"]', '11')
    await waitForTimeoutWithRetry(facturadorPage, 1000, null, 'Consultar - Tipo Comprobante')
    await facturadorPage.selectOption('select[name="puntoDeVenta"]', '1')
    await waitForTimeoutWithRetry(facturadorPage, 1000, null, 'Consultar - Punto de Venta')
    await facturadorPage.click('input[value="Buscar"]')
    await waitForTimeoutWithRetry(facturadorPage, 1000, null, 'Consultar - Buscar')
    // Listado

    await navigationPromise

    // Magia Oscura
    const rows = facturadorPage.locator(
      'table.jig_table tr td[title="Fecha de Emisión"]'
    )
    const count = await rows.count()
    let fechasComprobantes = []
    for (let i = 0; i < count; ++i) {
      fechasComprobantes.push(await rows.nth(i).textContent())
    }

    const buttons = facturadorPage.locator(
      'table.jig_table tr input[value="Ver"]'
    )
    const size = await buttons.count()

    for (let i = 0; i < size; i++) {
      const button = buttons.nth(i)
      const [download] = await Promise.all([
        // Start waiting for the download
        facturadorPage.waitForEvent('download'),
        // Perform the action that initiates download
        button.click(),
      ])

      await download.saveAs(
        `./invoices/factura-${process.env.USER_CUIL}-${dateAsString}${rounder(
          fechasComprobantes[i].split('/')[0]
        )}-${generateShortId()}.pdf`
      )
    }

    await waitForTimeoutWithRetry(facturadorPage, 1000, null, 'Consultar - Final')
  } catch (error) {
    logger.error('Error consultando facturas:', error)
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
