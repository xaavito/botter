const { TIMEOUT } = require('../constants.js')

async function emitidos(page) {
  await page.click('text=Emitidos')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  emitidos,
}
