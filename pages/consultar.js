const { TIMEOUT } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function consultar(page) {
  await page.click('text=Comprobantes en línea')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Consultar')
}

module.exports = {
  consultar,
}
