async function seleccionarPuntoVenta(page) {
  await page.selectOption(
    'select[name="puntoDeVenta"]',
    process.env.N_PUNTO_VENTA || '1'
  )
  await page.waitForTimeout(1000)
}

module.exports = {
  seleccionarPuntoVenta,
}
