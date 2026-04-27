const { esperarMinimo } = require('../helpers/waitHelpers.js')

async function obtenerValoresFacturas(page) {
  // Cambiar cantidad de items a 50 en la tabla (MEJORAR)
  await page.click('button.buttons-collection.buttons-page-length')
  await esperarMinimo(page, 500)
  await page.locator('li.button-page-length').nth(3).click()
  await esperarMinimo(page, 500)

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
