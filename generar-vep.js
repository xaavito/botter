// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature

const playwright = require('playwright');
const rounder = require('./helper.js');

async function main() {
  // disable headless to see the browser's action
  const browser = await playwright.chromium.launch({
    headless: false,
    args: ['--disable-dev-shm-usage']
  });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const navigationPromise = page.waitForNavigation({
    waitUntil: 'domcontentloaded'
  });

  await page.setDefaultNavigationTimeout(0);

  await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml');

  await page.waitForSelector('input[name="F1:username"]');
  await page.fill('input[name="F1:username"]', process.env.USER_CUIL);
  await page.click('input[name="F1:btnSiguiente"]');

  await page.waitForSelector('input[name="F1:password"]', { visible: true });
  await page.fill('input[name="F1:password"]', process.env.USER_PASS);
  await page.click('input[name="F1:btnIngresar"]');
  await navigationPromise;
  //await page.waitForTimeout(2000);
  await page.click('text=Adhesión y/o empadronamiento al monotributo, modificación de datos e ingreso de claves de confirmación');

  await page.waitForTimeout(3000);

  const pages = await context.pages();
  const monotributoPage = pages[1];

  const navigationPromiseMonotributo = monotributoPage.waitForNavigation({
    waitUntil: 'domcontentloaded'
  });


  //await navigationPromiseM;

  // Pagina
  await monotributoPage.click('a[id="aBtn1"]');
  await monotributoPage.waitForTimeout(1000);
  await navigationPromiseMonotributo;
  //await navigationPromiseM;
  // Pagina
  //await monotributoPage.click('img[title="Pago mis cuentas"]');
  // aca quede..
  await monotributoPage.locator('img[title="Pago mis cuentas"]').click();
  await monotributoPage.waitForTimeout(1000);
  //await navigationPromiseM;
  // Pagina
  await monotributoPage.click('input[value="GENERAR VOLANTE DE PAGO"]');
  await monotributoPage.waitForTimeout(1000);
  //await navigationPromiseM;

  //await monotributoPage.waitForTimeout(1000);
  //await browser.close();
}
main();
