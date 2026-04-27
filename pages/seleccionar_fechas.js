const { getFormatedDate } = require('../helper.js')
const { esperarMinimo, esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function seleccionarFechas(page, fechas) {
  await page.click('input[id="fechaEmision"]')
  await esperarMinimo(page, 300)
  await page.type(
    'input[name="daterangepicker_start"]',
    getFormatedDate(fechas.from)
  )
  await esperarMinimo(page, 300)
  await page.type(
    'input[name="daterangepicker_end"]',
    getFormatedDate(fechas.to)
  )
  await esperarMinimo(page, 300)
  await page.click('text=Aplicar')
  await esperarMinimo(page, 500)

  await page.click('text=Buscar')
  await esperarCargaPagina(page)
}

module.exports = {
  seleccionarFechas,
}
