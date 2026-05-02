const { TIMEOUT } = require('../constants.js')

async function consumidorFinal(page) {
  await page.selectOption('select[id="tipoComprobante"]', '11')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  consumidorFinal,
}
