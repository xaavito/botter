const { TIMEOUT } = require('../helpers/constants.js')

async function verTodos(page) {
  await page.click('text=Ver todos')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  verTodos,
}
