// npm install playwright
// may take a while for downloading binaries
// minimum node version 8 for async / await feature

const playwright = require('playwright');
const { rounder } = require('../helper.js');
const { login } = require("../helper");
let facturas;

// Carga dinamicamente el archivo de definiciones
try {
   facturas = require('./facturas.json');
} catch (e) {
   facturas = [];
   console.log('No se encontro el archivo facturas.json');
}

/**
 *
 * @param facturadorPage pagina de playrigth
 * @param factura Configuracion de c/u de las facturas, ver formato en README.md
 * @return {Promise<void>}
 */
async function generarPara(facturadorPage, factura) {
  // Pagina
  await facturadorPage.click('text=Generar Comprobantes');
  await facturadorPage.waitForTimeout(1000);
  // Pagina
  await facturadorPage.selectOption('select[name="puntoDeVenta"]', process.env.N_PUNTO_VENTA || '1');

  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.click('input[value="Continuar >"]');
  await facturadorPage.waitForTimeout(1000);

  // Pagina
  await facturadorPage.selectOption('select[name="idConcepto"]', factura.concepto);
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
  await facturadorPage.fill('textarea[name="detalleDescripcion"]', factura.descripcion);
  await facturadorPage.waitForTimeout(1000);
  await facturadorPage.fill('input[name="detallePrecio"]', factura.monto);

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

  const today = new Date();
  const dateAsString = `${today.getFullYear()}${rounder(today.getMonth() + 1)}${rounder(today.getDate())}`;
  await download.saveAs(
      `./downloads/factura-${process.env.USER_CUIL}-${dateAsString}.pdf`
  );
  await facturadorPage.waitForTimeout(1000);

  // Volver al menu para generar otro comprobante
  await facturadorPage.click('input[value="Menú Principal"]');
}

/**
 * Se auténtica y abre el RCEL para generar comprobantes.
 * @param facturas lista de las facturas que se van a generar.
 * @return {Promise<void>}
 */
async function generar(facturas) {

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

  await login(page);

  await navigationPromise;
  await page.click('text=Comprobantes en línea');
  await page.waitForTimeout(3000);

  let pages = await context.pages();
  const facturadorPage = pages[1];

  // Pagina
  await facturadorPage.click(`input[value="${process.env.USER_NAME}"]`);

  for (const factura of Array.from(facturas)) {
    try {
      await generarPara(facturadorPage, factura);
    } catch (e) {
      console.log('Fallo factura', e);
    }
  }
  await browser.close();
}

async function main() {
  generar(facturas);
}
main();
