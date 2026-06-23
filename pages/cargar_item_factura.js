const { randomDetalle, randomValorV2 } = require('../helpers/helper.js')
const { TIMEOUT_FILL } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

const cargarItemFactura = async (page, comprobanteNominado = null) => {
  let valor = 0
  let detalle = ''
  if (comprobanteNominado) {
    valor = comprobanteNominado.amount
    detalle = comprobanteNominado.descripcionItem
  } else {
    valor = randomValorV2()
    detalle = randomDetalle()
  }

  // Llenar campos consecutivamente sin timeouts redundantes
  await page.fill('input[name="detalleCodigoArticulo"]', '1')
  await page.fill('textarea[name="detalleDescripcion"]', detalle)
  await page.fill('input[name="detallePrecio"]', valor)
  // Solo esperar una vez al final antes del click
  await waitForTimeoutWithRetry(page, TIMEOUT_FILL, null, 'Cargar Item Factura')
  await page.click('input[value="Continuar >"]')

  return { detalle, valor }
}

module.exports = {
  cargarItemFactura,
}
