async function generarComprobantes(page) {
  await page.click('text=Generar Comprobantes')
  await page.waitForTimeout(1000)
}

module.exports = {
  generarComprobantes,
}
