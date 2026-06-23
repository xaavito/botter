const { getFormatedDate } = require('../helper.js')
const { TIMEOUT } = require('../constants.js')
const { waitForTimeoutWithRetry } = require('./waitHelpers.js')

async function seleccionarFechas(page, fechas) {
  await page.click('input[id="fechaEmision"]')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Seleccionar Fechas - Click')
  await page.type(
    'input[name="daterangepicker_start"]',
    getFormatedDate(fechas.from)
  )
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Seleccionar Fechas - Fecha Inicio')
  await page.type(
    'input[name="daterangepicker_end"]',
    getFormatedDate(fechas.to)
  )
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Seleccionar Fechas - Fecha Fin')
  await page.click('text=Aplicar')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Seleccionar Fechas - Aplicar')

  await page.click('text=Buscar')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Seleccionar Fechas - Buscar')
}

module.exports = {
  seleccionarFechas,
}
