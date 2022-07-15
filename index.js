// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature

const playwright = require('playwright');
const { rounder } = require('./helper.js');

async function main() {
  const today = new Date();
  const dateAsString = `${today.getFullYear()}${rounder(
    today.getMonth() + 1
  )}${rounder(today.getDate())}`;

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

  await navigationPromise;
  await page.waitForSelector('input[name="F1:username"]');
  await page.fill('input[name="F1:username"]', process.env.USER_CUIL);
  await page.click('input[name="F1:btnSiguiente"]');

  await page.waitForSelector('input[name="F1:password"]', { visible: true });
  await page.fill('input[name="F1:password"]', process.env.USER_PASS);
  await page.click('input[name="F1:btnIngresar"]');
  await navigationPromise;
  await page.click('text=Comprobantes en línea');
  await page.waitForTimeout(1000);

  let pages = await context.pages();
  const facturadorPage = pages[1];

  // Pagina
  await facturadorPage.click(`input[value="${process.env.USER_NAME}"]`);

  // Pagina
  await facturadorPage.click('text=Generar Comprobantes');
  await facturadorPage.waitForTimeout(1000);
  // Pagina
  await facturadorPage.selectOption('select[name="puntoDeVenta"]', '1');
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.click('input[value="Continuar >"]');
  await facturadorPage.waitForTimeout(1000);
  // Pagina
  await facturadorPage.selectOption('select[name="idConcepto"]', '2');
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.click('input[value="Continuar >"]');
  // Pagina
  await facturadorPage.selectOption('select[name="idIVAReceptor"]', '5');
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.click('input[name="formaDePago"]');
  await facturadorPage.click('input[value="Continuar >"]');
  await facturadorPage.waitForTimeout(1000);
  // Pagina
  await facturadorPage.fill('input[name="detalleCodigoArticulo"]', '1');
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.fill('textarea[name="detalleDescripcion"]', 'Servicios');
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.fill(
    'input[name="detallePrecio"]',
    process.env.USER_MONTO
  );
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.click('input[value="Continuar >"]');
  await facturadorPage.waitForTimeout(1000);

  //confirmacion
  await facturadorPage.evaluate(
    () =>
      (window.confirm = function () {
        return true;
      })
  );

  await facturadorPage.click('input[value="Confirmar Datos..."]');

  await facturadorPage.waitForTimeout(1000);

  // Imprimir factura
  const [download] = await Promise.all([
    // Start waiting for the download
    facturadorPage.waitForEvent('download'),
    // Perform the action that initiates download
    facturadorPage.click('input[value="Imprimir..."]')
  ]);

  await download.saveAs(
    `./downloads/factura-${process.env.USER_CUIL}-${dateAsString}.pdf`
  );

  await facturadorPage.waitForTimeout(1000);
  await browser.close();
}
main();
