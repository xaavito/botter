const fs = require('fs')
const path = require('path')
var csvWriter = require('csv-write-stream')

const rounder = (num) => ('0' + num).slice(-2)

const today = new Date()

const detallesArr = JSON.parse(process.env.DETALLES)
const valoresArr = JSON.parse(process.env.USER_MONTO || '["20000"]')
const maxTopeValue = process.env.TOPE_FACTURA
const valoresPorcentualesArr = JSON.parse(process.env.PORCENTAJES_FACTURACION)

const randomDetalle = () => {
  var random = Math.floor(Math.random() * detallesArr.length)
  return detallesArr[random] || 'Servicios'
}

const sanitizeDateToNoTime = (date) => date.setHours(0, 0, 0, 0)

const randomValor = () => {
  var random = Math.floor(Math.random() * valoresArr.length)
  return valoresArr[random]
}

const randomValorV2 = () => {
  var random = Math.floor(Math.random() * valoresPorcentualesArr.length)
  const newValue =
    maxTopeValue - (valoresPorcentualesArr[random] * maxTopeValue) / 100
  return redondearMiles(newValue).toString()
}

function redondearMiles(numero) {
  // Divide el número por 1000, redondea al entero más cercano, y multiplica por 1000
  return Math.round(numero / 1000) * 1000
}

const dateAsString = (date = today) =>
  `${date.getFullYear()}${rounder(date.getMonth() + 1)}${rounder(
    date.getDate()
  )}`

const oneYearBefore = () => {
  let oneYearBefore = new Date()
  oneYearBefore.setDate(today.getDate() - 364)
  return oneYearBefore
}

const getFirstDayOfLastYear = () => {
  const now = new Date()
  const lastYear = now.getFullYear() - 1
  return new Date(lastYear, 0, 1) // Año pasado, mes 0 (enero), día 1
}

const getLastDayOfLastYear = () => {
  const now = new Date()
  const lastYear = now.getFullYear() - 1
  return new Date(lastYear, 11, 31) // Año pasado, mes 0 (enero), día 1
}

const beginingOfCurrentMonth = () => {
  let beginingOfMonth = new Date()
  beginingOfMonth.setDate(1)
  sanitizeDateToNoTime(beginingOfMonth)
  return beginingOfMonth
}

const dateFormatted = (date = today) =>
  `${rounder(date.getDate())}/${rounder(
    date.getMonth() + 1
  )}/${date.getFullYear()}`

// DD/MM/YYYY
const stringDateToActualDate = (dateAsString) =>
  new Date(
    dateAsString.slice(6, 10),
    dateAsString.slice(3, 5) - 1,
    dateAsString.slice(0, 2)
  )

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

  try {
    // Append some data to CSV the file
    writer = csvWriter({ sendHeaders: false })
    writer.pipe(fs.createWriteStream(csvFilename, { flags: 'a' }))
    writer.write({
      header1: fecha,
      header2: item,
      header3: monto,
    })
    writer.end()
  } catch (error) {
    console.error(error)
  }
}

const writeToFile = async (resultado) => {
  const filePath = path.join(__dirname, 'usuarios.txt')
  const fileExists = fs.existsSync(filePath)

  if (!fileExists) {
    fs.writeFileSync(filePath, '')
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const lines = fileContent.split('\n')
  const cuitExists = lines.some((line) => line.includes(resultado.cuit))

  if (!cuitExists) {
    const newLine = `Usuario: ${resultado.user}, CUIT: ${resultado.cuit}\n`
    fs.appendFileSync(filePath, newLine)
  }
}

const readFromFile = () => {
  const filePath = path.join(__dirname, 'usuarios.txt')
  const fileExists = fs.existsSync(filePath)

  if (!fileExists) {
    return []
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const lines = fileContent.split('\n').filter(line => line.trim() !== '')

  return lines.map(line => {
    const [userPart, cuitPart] = line.split(', ')
    const name = userPart.split(': ')[1]
    const value = cuitPart.split(': ')[1]
    return { name, value }
  })
}

module.exports = {
  rounder,
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
  oneYearBefore,
  stringDateToActualDate,
  sanitizeDateToNoTime,
  beginingOfCurrentMonth,
  randomValorV2,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
  writeToFile,
  readFromFile
}
