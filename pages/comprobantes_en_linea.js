async function comprobantesEnLinea(page) {
  await page.click('text=Comprobantes en línea')
  await page.waitForTimeout(1000)
}

module.exports = {
  comprobantesEnLinea,
}
