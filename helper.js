const fs = require('fs')
var csvWriter = require('csv-write-stream')

const rounder = (num) => ('0' + num).slice(-2)

let detallesArr = JSON.parse(process.env.DETALLES)
let valoresArr = JSON.parse(process.env.USER_MONTO)

const randomDetalle = () => {
  var random = Math.floor(Math.random() * detallesArr.length)
  return detallesArr[random] || 'Servicios'
}

const randomValor = () => {
  var random = Math.floor(Math.random() * valoresArr.length)
  return valoresArr[random]
}

const today = new Date()

const dateAsString = () =>
  `${today.getFullYear()}${rounder(today.getMonth() + 1)}${rounder(
    today.getDate()
  )}`

const dateFormatted = () =>
  `${rounder(today.getDate())}/${rounder(
    today.getMonth() + 1
  )}/${today.getFullYear()}`

// Dado '$ 20.000,00' devuelve 20000
const sanitizeNumber = (number) => {
  let result = number.split('$')[1].trim()
  result = parseInt(result.split(',')[0].replace('.', ''))
  return result
}

const getFormatedDate = (myDate) => {
  // returns DD/MM/YYYY
  var day = myDate.getDate()
  var month = myDate.getMonth() + 1
  var year = myDate.getFullYear()

  if (day < 10) {
    day = '0' + day
  }
  if (month < 10) {
    month = '0' + month
  }

  return `${day}/${month}/${year}`
}

const subtractYears = (numOfYears, date = new Date()) => {
  return new Date(date.setFullYear(date.getFullYear() - numOfYears))
}

const addDays = (date, numOfDays) => {
  var myDate = new Date(date)
  return new Date(myDate.setDate(myDate.getDate() + numOfDays))
}

/**
 * Devuelve array de fechas de 27 días empezando de 1 año atrás desde hoy.
 * Ej: { from: 2021-10-31T01:34:49.818Z, to: 2021-11-27T01:34:49.818Z }
 * @returns Array
 */
const getDatesfromOneYearBack = () => {
  var minus1year = subtractYears(1)
  let endYear = false
  let fromDate = minus1year,
    toDate

  var datesArr = []

  while (!endYear) {
    toDate = addDays(fromDate, 30)

    if (toDate > new Date()) {
      toDate = new Date()
      endYear = true
    }

    datesArr.push({ from: fromDate, to: toDate })
    fromDate = addDays(toDate, 1)
  }

  return datesArr
}

/**
 * Autentica en la pagina del afip completando user and password
 * Usa las credenciales de .env
 * @param page {Page}
 * @returns {Promise<void>}
 */
async function login(page) {
  await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml')
  await page.waitForSelector('input[name="F1:username"]')
  await page.fill('input[name="F1:username"]', process.env.USER_CUIL)
  await page.click('input[name="F1:btnSiguiente"]')
  await page.waitForSelector('input[name="F1:password"]', { visible: true })
  await page.fill('input[name="F1:password"]', process.env.USER_PASS)
  await page.click('input[name="F1:btnIngresar"]')
}

/**
 * Guarda facturas generadas a CSV, la crea o agrega
 * @param {date} fecha
 * @param {string} item
 * @param {string} monto
 */
function saveToCSV(fecha, item, monto, fileName = false) {
  var writer = csvWriter({ sendHeaders: false }) //Instantiate var
  var csvFilename
  if (fileName) {
    csvFilename = `${fileName}.csv`
  } else {
    csvFilename = `${process.env.USER_CUIL}.csv`
  }

  // If CSV file does not exist, create it and add the headers
  if (!fs.existsSync(csvFilename)) {
    writer = csvWriter({ sendHeaders: false })
    writer.pipe(fs.createWriteStream(csvFilename))
    writer.write({
      header1: 'Fecha',
      header2: 'Item',
      header3: 'Monto',
    })
    writer.end()
  }

  // Append some data to CSV the file
  writer = csvWriter({ sendHeaders: false })
  writer.pipe(fs.createWriteStream(csvFilename, { flags: 'a' }))
  writer.write({
    header1: fecha,
    header2: item,
    header3: monto,
  })
  writer.end()
}

module.exports = {
  rounder,
  login,
  randomDetalle,
  randomValor,
  saveToCSV,
  dateAsString,
  dateFormatted,
  sanitizeNumber,
  getFormatedDate,
  subtractYears,
  addDays,
  today,
  getDatesfromOneYearBack,
}
