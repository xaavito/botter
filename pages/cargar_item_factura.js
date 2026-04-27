const { randomDetalle, randomValorV2 } = require('../helpers/helper.js')
const { esperarMinimo } = require('../helpers/waitHelpers.js')

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
  await esperarMinimo(page, 300)
  await page.fill('textarea[name="detalleDescripcion"]', detalle)
  await esperarMinimo(page, 300)
  await page.fill('input[name="detallePrecio"]', valor)
  await esperarMinimo(page, 300)
  await page.click('input[value="Continuar >"]')

  return { detalle, valor }
}

module.exports = {
  cargarItemFactura,
}
