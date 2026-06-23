const { TIMEOUT } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function valoresFacturas(page) {
  await page.click('text=Ver todos')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Valores Facturas - Ver Todos')
  await page.click('button.buttons-collection.buttons-page-length')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Valores Facturas - Page Length')
  await page.locator('li.button-page-length').nth(3).click()
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Valores Facturas - Select Length')
}

module.exports = {
  valoresFacturas,
}
