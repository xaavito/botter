const { TIMEOUT } = require('../helpers/constants.js')

async function generarComprobantes(page) {
  await page.click('text=Generar Comprobantes')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  generarComprobantes,
}
