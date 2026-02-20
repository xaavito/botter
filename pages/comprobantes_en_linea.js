const { TIMEOUT } = require('../helpers/constants.js')

async function comprobantesEnLinea(page) {
  await page.click('text=Comprobantes en línea')
  // await page.waitForNavigation({ waitUntil: 'networkidle0' })
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  comprobantesEnLinea,
}
