const { TIMEOUT } = require('../constants.js')

async function puntoVentaModal(page) {
  await page.click('id=btnMostrarPuntosVentas')
  await page.waitForTimeout(TIMEOUT)

  await page.selectOption(
    'select[id="listaPuntosVentaModal"]',
    '00001'
  )
  await page.waitForTimeout(TIMEOUT)

  await page.click('id=btnAceptarModal')
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  puntoVentaModal,
}
