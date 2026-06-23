const { TIMEOUT_FILL } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

const cargarConcepto = async (page) => {
  await page.selectOption('select[name="idConcepto"]', '2')
  await waitForTimeoutWithRetry(page, TIMEOUT_FILL, null, 'Cargar Concepto')
  //TODO
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarConcepto,
}
