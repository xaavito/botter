const { TIMEOUT_NAVIGATION } = require('../helpers/constants.js')

async function generarComprobantes(page) {
  await page.click('text=Generar Comprobantes')
  await page.waitForTimeout(TIMEOUT_NAVIGATION)
}

module.exports = {
  generarComprobantes,
}
