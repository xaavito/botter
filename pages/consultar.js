const { TIMEOUT } = require('../constants.js')

async function consultar(page) {
  await page.click('text=Consulta')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  consultar,
}
