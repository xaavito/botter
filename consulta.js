// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature
require('dotenv').config();

const path = require('path');

const playwright = require('playwright');

async function main() {
  const today = new Date();
  const dateAsString = `${today.getFullYear()}${
    today.getMonth() + 1
  }${today.getDate()}`;

  const firstDayOfThisMonth = `1/${today.getMonth() + 1}/${today.getFullYear()}`;
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
  /*
  await page.setDefaultNavigationTimeout(0);
  */
  await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml');

  await navigationPromise;
  await page.waitForSelector('input[name="F1:username"]');
  await page.fill('input[name="F1:username"]', process.env.USER_CUIL);
  await page.click('input[name="F1:btnSiguiente"]');

  await page.waitForSelector('input[name="F1:password"]', { visible: true });
  await page.fill('input[name="F1:password"]', process.env.USER_PASS);
  await page.click('input[name="F1:btnIngresar"]');
  await navigationPromise;
  await page.click('text=Comprobantes en línea');
  await page.waitForTimeout(6000);

  let pages = await context.pages();
  const facturadorPage = pages[1];
  //console.log(pages)

  // Pagina
  await navigationPromise;
  await facturadorPage.click(`input[value="${process.env.USER_NAME}"]`);

  // Acceder a Consultas
  await navigationPromise;
  await facturadorPage.click('text=Consultas');
  await facturadorPage.waitForTimeout(2000);
  // Search
  await navigationPromise;
  await facturadorPage.fill('input[name="fechaEmisionDesde"]', firstDayOfThisMonth);
  await facturadorPage.selectOption('select[name="idTipoComprobante"]', '11');
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.selectOption('select[name="puntoDeVenta"]', '1');
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.click('input[value="Buscar"]');
  await facturadorPage.waitForTimeout(1000);
  // Listado

  await navigationPromise;
  // Imprimir factura
  const [download] = await Promise.all([
    // Start waiting for the download
    facturadorPage.waitForEvent('download'),
    // Perform the action that initiates download
    facturadorPage.click('input[value="Ver"]')
  ]);

  await download.saveAs(
    `./downloads/factura-${process.env.USER_CUIL}-${dateAsString}.pdf`
  );

  await facturadorPage.waitForTimeout(3000);
  await browser.close();
}
main();
