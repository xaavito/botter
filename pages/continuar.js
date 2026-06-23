const { TIMEOUT_CLICK } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function continuar(page) {
  await page.click('input[value="Continuar >"]')
  await waitForTimeoutWithRetry(page, TIMEOUT_CLICK, null, 'Continuar')
}

module.exports = {
  continuar,
}
