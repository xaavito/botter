const fs = require('fs');
var csvWriter = require('csv-write-stream');

const rounder = (num) => ('0' + num).slice(-2);

let detallesArr = JSON.parse(process.env.DETALLES);
let valoresArr = JSON.parse(process.env.USER_MONTO);

const randomDetalle = () => {
  var random = Math.floor(Math.random() * detallesArr.length);
  return detallesArr[random] || 'Servicios';
};

const randomValor = () => {
  var random = Math.floor(Math.random() * valoresArr.length);
  return valoresArr[random];
};

const today = new Date();

const dateAsString = () =>
  `${today.getFullYear()}${rounder(today.getMonth() + 1)}${rounder(
    today.getDate()
  )}`;

const dateFormatted = () =>
  `${rounder(today.getDate())}/${rounder(
    today.getMonth() + 1
  )}/${today.getFullYear()}`;

/**
 * Autentica en la pagina del afip completando user and password
 * Usa las credenciales de .env
 * @param page {Page}
 * @returns {Promise<void>}
 */
async function login(page) {
  await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml');
  await page.waitForSelector('input[name="F1:username"]');
  await page.fill('input[name="F1:username"]', process.env.USER_CUIL);
  await page.click('input[name="F1:btnSiguiente"]');
  await page.waitForSelector('input[name="F1:password"]', { visible: true });
  await page.fill('input[name="F1:password"]', process.env.USER_PASS);
  await page.click('input[name="F1:btnIngresar"]');
}

/**
 * Guarda facturas generadas a CSV, la crea o agrega
 * @param {date} fecha
 * @param {string} item
 * @param {string} monto
 */
function saveToCSV(fecha, item, monto) {
  var writer = csvWriter({ sendHeaders: false }); //Instantiate var
  var csvFilename = `${process.env.CUIL}.csv`;

  // If CSV file does not exist, create it and add the headers
  if (!fs.existsSync(csvFilename)) {
    writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream(csvFilename));
    writer.write({
      header1: 'Fecha',
      header2: 'Item',
      header3: 'Monto'
    });
    writer.end();
  }

  // Append some data to CSV the file
  writer = csvWriter({ sendHeaders: false });
  writer.pipe(fs.createWriteStream(csvFilename, { flags: 'a' }));
  writer.write({
    header1: fecha,
    header2: item,
    header3: monto
  });
  writer.end();
}

module.exports = {
  rounder,
  login,
  randomDetalle,
  randomValor,
  saveToCSV,
  dateAsString,
  dateFormatted
};
