const { TIMEOUT } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function consumidorFinal(page) {
  await page.selectOption('select[name="idConcepto"]', '2')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Consumidor Final')
}

module.exports = {
  consumidorFinal,
}
