const { TIMEOUT } = require('../helpers/constants.js')

async function continuar(page) {
  await page.click('input[value="Continuar >"]')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  continuar,
}
