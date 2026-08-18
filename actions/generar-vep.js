// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature

const { launchBrowser } = require('../helpers/helper.js')
const { login } = require('../pages/login.js')
const { esperarNuevaPestana } = require('../helpers/waitHelpers.js')
const logger = require('../helpers/logger.js')


/**
 * Genera Volante Electrónico de Pago (VEP) para monotributo
 * @returns {Promise<void>}
 * @throws {Error} Si falla la generación
 */
async function main() {
  let browser
  
  try {
    // disable headless to see the browser's action
    browser = await launchBrowser()
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()

  //const navigationPromise = page.waitForNavigation({
  //waitUntil: 'domcontentloaded',
  //})

  await page.setDefaultNavigationTimeout(0)

  await login(page)

  await page.click(
    'text=Adhesión y/o empadronamiento al monotributo, modificación de datos e ingreso de claves de confirmación'
  )

  const monotributoPage = await esperarNuevaPestana(context)


  const navigationPromiseMonotributo = monotributoPage.waitForNavigation({
    waitUntil: 'domcontentloaded',
  })

  //await navigationPromiseM;

  // Pagina
  await monotributoPage.click('a[id="aBtn1"]')
  await monotributoPage.waitForTimeout(1000)
  await navigationPromiseMonotributo
  //await navigationPromiseM;
  // Pagina
  //await monotributoPage.click('img[title="Pago mis cuentas"]');
  // aca quede..
  await monotributoPage.locator('img[title="Pago mis cuentas"]').click()
  await monotributoPage.waitForTimeout(1000)
  //await navigationPromiseM;
  // Pagina
  await monotributoPage.click('input[value="GENERAR VOLANTE DE PAGO"]')
  await monotributoPage.waitForTimeout(1000)
  //await navigationPromiseM;

  //await monotributoPage.waitForTimeout(1000);
  } catch (error) {
    logger.error('Error generando VEP:', error)
    throw error
  } finally {
    if (browser) {
      await browser.close().catch(err => 
        logger.error('Error cerrando browser:', err)
      )
    }
  }
}
main()
