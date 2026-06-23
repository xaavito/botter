const { TIMEOUT_NAVIGATION } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function generarComprobantes(page) {
  await page.click('text=Generar Comprobantes')
  await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Generar Comprobantes')
}

module.exports = {
  generarComprobantes,
}
