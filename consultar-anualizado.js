// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature
const {
  login,
  rounder,
  sanitizeNumber,
  getFormatedDate,
  getDatesfromOneYearBack,
} = require('./helper.js')

const playwright = require('playwright')
const uuid = require('uuid')

async function main() {
  // disable headless to see the browser's action
  const browser = await playwright.chromium.launch({
    headless: false,
    args: ['--disable-dev-shm-usage'],
  })
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()

  const navigationPromise = page.waitForNavigation({
    waitUntil: 'domcontentloaded',
  })

  await login(page)

  await page.click('text=Mis Comprobantes')
  await page.waitForTimeout(1000)

  let pages = await context.pages()
  await page.waitForTimeout(1000)
  const facturadorPage = pages[1]
  await page.waitForTimeout(1000)

  // Acceder a Consultas
  try {
    await navigationPromise
    await facturadorPage.waitForTimeout(2000)
  } catch (error) {
    console.log('Sitio de la afip lento. Reintentar.')
    throw error
  }
  await facturadorPage.click('text=Emitidos')
  await facturadorPage.waitForTimeout(1000)

  await facturadorPage.selectOption('select[id="tipoComprobante"]', '11')
  await facturadorPage.waitForTimeout(1000)

  await facturadorPage.click('id=btnMostrarPuntosVentas')
  await facturadorPage.waitForTimeout(1000)

  await facturadorPage.selectOption('select[id="listaPuntosVentaModal"]', '00001')
  await facturadorPage.waitForTimeout(1000)

  await facturadorPage.click('id=btnAceptarModal')
  await facturadorPage.waitForTimeout(1000)

  //REPETIR POR CADA FECHA
  var datesArr = getDatesfromOneYearBack()
  let totalAnual = 0
  // datesArr.forEach(async e => {
  for (const e of datesArr) {
    await facturadorPage.click('input[id="fechaEmision"]')
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.type('input[name="daterangepicker_start"]', getFormatedDate(e.from))
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.type('input[name="daterangepicker_end"]', getFormatedDate(e.to))
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.click('text=Aplicar')
    await facturadorPage.waitForTimeout(1000)

    await facturadorPage.click('text=Buscar')
    await facturadorPage.waitForTimeout(1000)
  
    // Cambiar cantidad de items a 50 en la tabla (MEJORAR)
    await facturadorPage.click('button.buttons-collection.buttons-page-length')
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.locator('li.button-page-length').nth(3).click()
    await facturadorPage.waitForTimeout(1000)
  
    const rows = await facturadorPage.locator(
      'table#tablaDataTables tr td.alignRight'
    )
    const count = await rows.count()
    for (let i = 0; i < count; ++i) {
      totalAnual += sanitizeNumber(await rows.nth(i).textContent())
    }
    await facturadorPage.click('text=Consulta')
    await facturadorPage.waitForTimeout(1000)
  }

  console.log(`Total facturado desde ${datesArr[0].from} hasta ${datesArr.slice(-1)[0].to}: $${totalAnual}`)

  // ToDo downgrade next timeout
  await facturadorPage.waitForTimeout(10000)
  await browser.close()
}
main()
