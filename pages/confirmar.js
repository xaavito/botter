const { TIMEOUT_CLICK } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function confirmar(page) {
  await waitForTimeoutWithRetry(page, TIMEOUT_CLICK, null, 'Confirmar')
}

module.exports = {
  confirmar,
}
