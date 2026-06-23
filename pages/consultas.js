const { TIMEOUT } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function consultas(page) {
  await page.click('input[value="Continuar >"]')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Consultas')
}

module.exports = {
  consultas,
}
