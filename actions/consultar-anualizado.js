const {
  sanitizeNumber,
  getDatesfromOneYearBack,
  saveToCSV,
} = require('./helper.js')

const { login } = require('./pages/login.js')
const { verTodos } = require('./pages/ver_todos.js')
const { misComprobantes } = require('./pages/mis_comprobantes.js')
const { emitidos } = require('./pages/emitidos.js')
const { consumidorFinal } = require('./pages/consumidor_final.js')
const { puntoVentaModal } = require('./pages/pto_vta_modal.js')
const { seleccionarFechas } = require('./pages/seleccionar_fechas.js')
const { obtenerValoresFacturas } = require('./pages/valores_facturas.js')
const { consultar } = require('./pages/consultar.js')

const playwright = require('playwright')

const logger = require('./logger')

async function main() {
  // disable headless to see the browser's action
  const browser = await playwright.chromium.launch({
    headless: false,
    args: ['--disable-dev-shm-usage'],
    ...(process.env.CHROME === 'true' && { channel: 'chrome' }),
  })
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
  var datesArr = getDatesfromOneYearBack()
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
  await facturadorPage.waitForTimeout(10000)
  await browser.close()
}
main()
