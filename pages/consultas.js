const { TIMEOUT } = require('../constants.js')

async function consultas(page) {
  await page.click('text=Consultas')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  consultas,
}
