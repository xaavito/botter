const { TIMEOUT } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function buscar(page) {
  await page.click('text=Buscar')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Buscar')
}

module.exports = {
  buscar,
}
