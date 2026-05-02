const { getFormatedDate } = require('../helper.js')
const { TIMEOUT } = require('../constants.js')

async function seleccionarFechas(page, fechas) {
  await page.click('input[id="fechaEmision"]')
  await page.waitForTimeout(TIMEOUT)
  await page.type(
    'input[name="daterangepicker_start"]',
    getFormatedDate(fechas.from)
  )
  await page.waitForTimeout(TIMEOUT)
  await page.type(
    'input[name="daterangepicker_end"]',
    getFormatedDate(fechas.to)
  )
  await page.waitForTimeout(TIMEOUT)
  await page.click('text=Aplicar')
  await page.waitForTimeout(TIMEOUT)

  await page.click('text=Buscar')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  seleccionarFechas,
}
