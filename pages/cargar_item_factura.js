const { randomDetalle, randomValorV2 } = require('../helper.js')
const { TIMEOUT } = require('../constants.js')

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

  await page.fill('input[name="detalleCodigoArticulo"]', '1')
  await page.waitForTimeout(TIMEOUT)
  await page.fill('textarea[name="detalleDescripcion"]', detalle)
  await page.waitForTimeout(TIMEOUT)
  await page.fill('input[name="detallePrecio"]', valor)
  await page.waitForTimeout(TIMEOUT)
  await page.click('input[value="Continuar >"]')

  return { detalle, valor }
}

module.exports = {
  cargarItemFactura,
}
