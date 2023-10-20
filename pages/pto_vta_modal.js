async function puntoVentaModal(page) {
  await page.click('id=btnMostrarPuntosVentas')
  await page.waitForTimeout(1000)

  await page.selectOption(
    'select[id="listaPuntosVentaModal"]',
    '00001'
  )
  await page.waitForTimeout(1000)

  await page.click('id=btnAceptarModal')
  await page.waitForTimeout(1000)
}

module.exports = {
  puntoVentaModal,
}
