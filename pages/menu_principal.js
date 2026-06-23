const { TIMEOUT_NAVIGATION } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function menuPrincipal(page) {
  await page.click('input[value="Menú Principal"]')
  await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Menú Principal')
}

module.exports = {
  menuPrincipal,
}
