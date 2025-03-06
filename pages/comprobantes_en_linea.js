const { TIMEOUT } = require('../constants.js')

async function comprobantesEnLinea(page) {
  await page.click('text=Comprobantes en línea')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  comprobantesEnLinea,
}
