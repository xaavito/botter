const { TIMEOUT_NAVIGATION } = require('../helpers/constants.js')

async function verTodos(page) {
  await page.click('text=Ver todos')
  await page.waitForTimeout(TIMEOUT_NAVIGATION)
}

module.exports = {
  verTodos,
}
