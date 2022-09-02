// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature
const { login, rounder } = require('./helper.js')
const playwright = require('playwright')
const uuid = require('uuid')

async function main() {
  const today = new Date()
  const dateAsString = `${today.getFullYear()}${rounder(today.getMonth() + 1)}`

  const firstDayOfThisMonth = `1/${rounder(
    today.getMonth() + 1
  )}/${today.getFullYear()}`
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

  await page.click('text=Comprobantes en línea')
  await page.waitForTimeout(1000)

  let pages = await context.pages()
  const facturadorPage = pages[1]
  //console.log(pages)

  // Pagina
  await navigationPromise
  await facturadorPage.click(`input[value="${process.env.USER_NAME}"]`)

  // Acceder a Consultas
  await navigationPromise
  await facturadorPage.click('text=Consultas')
  await facturadorPage.waitForTimeout(1000)
  // Search
  await navigationPromise
  await facturadorPage.fill(
    'input[name="fechaEmisionDesde"]',
    firstDayOfThisMonth
  )
  await facturadorPage.selectOption('select[name="idTipoComprobante"]', '11')
  await facturadorPage.waitForTimeout(1000)
  await facturadorPage.selectOption('select[name="puntoDeVenta"]', '1')
  await facturadorPage.waitForTimeout(1000)
  await facturadorPage.click('input[value="Buscar"]')
  await facturadorPage.waitForTimeout(1000)
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
      `./downloads/factura-${process.env.USER_CUIL}-${dateAsString}${rounder(
        fechasComprobantes[i].split('/')[0]
      )}-${uuid.v1()}.pdf`
    )
  }

  await facturadorPage.waitForTimeout(1000)
  await browser.close()
}
main()
