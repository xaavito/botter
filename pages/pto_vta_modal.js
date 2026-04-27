const { esperarMinimo, esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function puntoVentaModal(page) {
  await page.click('id=btnMostrarPuntosVentas')
  await esperarMinimo(page, 500)

  await page.selectOption(
    'select[id="listaPuntosVentaModal"]',
    '00001'
  )
  await esperarMinimo(page, 300)

  await page.click('id=btnAceptarModal')
  await esperarCargaPagina(page)
}

module.exports = {
  puntoVentaModal,
}
