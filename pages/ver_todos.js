const { TIMEOUT_NAVIGATION } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function verTodos(page) {
  await page.click('text=Ver todos')
  await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Ver Todos')
}

module.exports = {
  verTodos,
}
