const { randomDetalle, randomValorV2 } = require('../helper.js')

const cargarItemFactura = async (page, comprobanteNominado = null) => {
  console.log('cargarItemFactura', comprobanteNominado)
  let valor = 0
  if (comprobanteNominado) {
    const [cuit, monto] = comprobanteNominado.split(' ')
    valor = monto
  } else {
    valor = randomValorV2()
  }
  const detalle = randomDetalle()

  await page.fill('input[name="detalleCodigoArticulo"]', '1')
  await page.waitForTimeout(1000)
  await page.fill('textarea[name="detalleDescripcion"]', detalle)
  await page.waitForTimeout(1000)
  await page.fill('input[name="detallePrecio"]', valor)
  await page.waitForTimeout(1000)
  await page.click('input[value="Continuar >"]')

  return { detalle, valor }
}

module.exports = {
  cargarItemFactura,
}
