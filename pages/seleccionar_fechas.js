const { getFormatedDate } = require('../helper.js')

async function seleccionarFechas(page, fechas) {
  await page.click('input[id="fechaEmision"]')
  await page.waitForTimeout(1000)
  await page.type(
    'input[name="daterangepicker_start"]',
    getFormatedDate(fechas.from)
  )
  await page.waitForTimeout(1000)
  await page.type(
    'input[name="daterangepicker_end"]',
    getFormatedDate(fechas.to)
  )
  await page.waitForTimeout(1000)
  await page.click('text=Aplicar')
  await page.waitForTimeout(1000)

  await page.click('text=Buscar')
  await page.waitForTimeout(1000)
}

module.exports = {
  seleccionarFechas,
}
