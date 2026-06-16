const { TIMEOUT_NAVIGATION } = require('../helpers/constants.js')

async function menuPrincipal(page) {
  await page.click('input[value="Menú Principal"]')
  await page.waitForTimeout(TIMEOUT_NAVIGATION)
}

module.exports = {
  menuPrincipal,
}
