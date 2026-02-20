const { getFirstDayOfActualYear } = require('../helpers/helper.js')
const { TIMEOUT } = require('../helpers/constants.js')

async function seleccionarFechaDesde(page) {
  page.fill('input[name="fechaEmisionDesde"]', getFirstDayOfActualYear())
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  seleccionarFechaDesde,
}
