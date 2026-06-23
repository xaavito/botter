const { TIMEOUT } = require('../constants.js')
const { waitForTimeoutWithRetry } = require('./waitHelpers.js')

async function emitidos(page) {
  await page.click('text=Emitidos')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Emitidos')
}

module.exports = {
  emitidos,
}
