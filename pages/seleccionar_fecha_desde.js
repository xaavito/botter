const { getFirstDayOfActualYear } = require('../helpers/helper.js')
const { esperarMinimo } = require('../helpers/waitHelpers.js')

async function seleccionarFechaDesde(page) {
  page.fill('input[name="fechaEmisionDesde"]', getFirstDayOfActualYear())
  await esperarMinimo(page, 500)
}

module.exports = {
  seleccionarFechaDesde,
}
