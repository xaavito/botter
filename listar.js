const csv = require('csv-parser')
const fs = require('fs')

const {
  oneYearBefore,
  stringDateToActualDate,
  today,
  sanitizeDateToNoTime,
  beginingOfCurrentMonth,
} = require('./helper.js')

const csvFilename = `${process.env.USER_CUIL}.csv`

const listar = async (tipoTotal) => {
  let invoices = []
  fs.createReadStream(csvFilename)
    .pipe(csv())
    .on('data', (row) => {
      invoices.push(row)
    })
    .on('end', () => {

      let monto = 0
      if (tipoTotal === 'anual') {
        invoices.forEach((factura) => {
          if (factura.Fecha) {
            if (
              sanitizeDateToNoTime(stringDateToActualDate(factura.Fecha)) <=
                sanitizeDateToNoTime(today) &&
              sanitizeDateToNoTime(stringDateToActualDate(factura.Fecha)) >=
                sanitizeDateToNoTime(oneYearBefore(sanitizeDateToNoTime))
            ) {
              monto += parseFloat(factura.Monto)
            }
          }
        })
        console.log(
          'Total Anualizado: $' +
            monto +
            ' entre ' +
            oneYearBefore() +
            ' y ' +
            today
        )
      }
      if (tipoTotal === 'mensual') {
        invoices.forEach((factura) => {
          if (factura.Fecha) {
            if (
              sanitizeDateToNoTime(stringDateToActualDate(factura.Fecha)) <=
                sanitizeDateToNoTime(today) &&
              sanitizeDateToNoTime(stringDateToActualDate(factura.Fecha)) >=
                sanitizeDateToNoTime(beginingOfCurrentMonth(sanitizeDateToNoTime))
            ) {
              monto += parseFloat(factura.Monto)
            }
          }
        })
        console.log(
          'Total Mensual: $' +
            monto +
            ' entre ' +
            beginingOfCurrentMonth(sanitizeDateToNoTime) +
            ' y ' +
            today
        )
      }
    })
}

module.exports = { listar }
