const { randomDetalle, randomValor } = require('../helper.js')

async function cargarItemFactura(page) {
  const detalle = randomDetalle()
  const valor = randomValor()

  await page.fill('input[name="detalleCodigoArticulo"]', '1')
  await page.waitForTimeout(1000)
  await page.fill('textarea[name="detalleDescripcion"]', detalle)
  await page.waitForTimeout(1000)
  await page.fill('input[name="detallePrecio"]', valor)
  await page.waitForTimeout(1000)
  await page.click('input[value="Continuar >"]')
  await page.waitForTimeout(1000)

  return { detalle, valor }
}

module.exports = {
  cargarItemFactura,
}
