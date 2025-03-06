const { TIMEOUT } = require('../constants.js')

async function obtenerValoresFacturas(page) {
  // Cambiar cantidad de items a 50 en la tabla (MEJORAR)
  await page.click('button.buttons-collection.buttons-page-length')
  await page.waitForTimeout(TIMEOUT)
  await page.locator('li.button-page-length').nth(3).click()
  await page.waitForTimeout(TIMEOUT)

  const rowsAmounts = await page.locator(
    'table#tablaDataTables tr td.alignRight'
  )

  const rowsDates = await page.locator(
    'table#tablaDataTables tr td:first-child'
  )

  return { rowsAmounts, rowsDates }
}

module.exports = {
  obtenerValoresFacturas,
}
