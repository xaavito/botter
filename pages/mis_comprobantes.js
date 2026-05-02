const { TIMEOUT } = require('../constants.js')

async function misComprobantes(page) {
  await page.click('text=MIS COMPROBANTES')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  misComprobantes,
}
