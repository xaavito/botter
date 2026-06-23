const { TIMEOUT } = require('../constants.js')
const { waitForTimeoutWithRetry } = require('./waitHelpers.js')

async function misComprobantes(page) {
  await page.click('text=MIS COMPROBANTES')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Mis Comprobantes')
}

module.exports = {
  misComprobantes,
}
