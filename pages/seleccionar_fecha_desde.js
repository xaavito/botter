const { getFirstDayOfActualYear } = require('../helpers/helper.js')
const { TIMEOUT } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function seleccionarFechaDesde(page) {
  page.fill('input[name="fechaEmisionDesde"]', getFirstDayOfActualYear())
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Seleccionar Fecha Desde')
}

module.exports = {
  seleccionarFechaDesde,
}
