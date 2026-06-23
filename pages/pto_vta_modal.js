const { TIMEOUT } = require('../constants.js')
const { waitForTimeoutWithRetry } = require('./waitHelpers.js')

async function puntoVentaModal(page) {
  await page.click('id=btnMostrarPuntosVentas')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Punto Venta Modal - Mostrar')

  await page.selectOption(
    'select[id="listaPuntosVentaModal"]',
    '00001'
  )
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Punto Venta Modal - Select')

  await page.click('id=btnAceptarModal')
  await waitForTimeoutWithRetry(page, TIMEOUT, null, 'Punto Venta Modal - Aceptar')
}

module.exports = {
  puntoVentaModal,
}
