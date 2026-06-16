const { TIMEOUT_CLICK } = require('../helpers/constants.js')

async function continuar(page) {
  await page.click('input[value="Continuar >"]')
  await page.waitForTimeout(TIMEOUT_CLICK)
}

module.exports = {
  continuar,
}
