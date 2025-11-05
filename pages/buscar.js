const { TIMEOUT } = require('../constants.js')

async function buscar(page) {
  await page.click('text=Buscar')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  buscar,
}
