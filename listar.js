const csv = require('csv-parser')
const fs = require('fs')

const {
  oneYearBefore,
  stringDateToActualDate,
  today,
  sanitizeDateToNoTime,
  beginingOfCurrentMonth,
  dateFormatted,
} = require('./helper.js')

const logger = require('./logger')

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
              monto += parseFloat(factura.Monto || '0')
            }
          }
        })
        logger.info(
          'Total Anualizado: $' +
            monto +
            ' entre ' +
            dateFormatted(oneYearBefore()) +
            ' y ' +
            dateFormatted(today)
        )
      }
      if (tipoTotal === 'mensual') {
        invoices.forEach((factura) => {
          if (factura.Fecha) {
            if (
              sanitizeDateToNoTime(stringDateToActualDate(factura.Fecha)) <=
                sanitizeDateToNoTime(today) &&
              sanitizeDateToNoTime(stringDateToActualDate(factura.Fecha)) >=
                sanitizeDateToNoTime(
                  beginingOfCurrentMonth(sanitizeDateToNoTime)
                )
            ) {
              monto += parseFloat(factura.Monto || '0')
            }
          }
        })
        logger.info(
          'Total Mensual: $' +
            monto +
            ' entre ' +
            dateFormatted(beginingOfCurrentMonth(sanitizeDateToNoTime)) +
            ' y ' +
            dateFormatted(today)
        )
      }
    })
}

module.exports = { listar }
