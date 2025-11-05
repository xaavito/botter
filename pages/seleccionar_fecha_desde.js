const { getFirstDayOfActualYear } = require('../helper.js')
const { TIMEOUT } = require('../constants.js')

async function seleccionarFechaDesde(page) {
  page.fill('input[name="fechaEmisionDesde"]', getFirstDayOfActualYear())
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  seleccionarFechaDesde,
}
