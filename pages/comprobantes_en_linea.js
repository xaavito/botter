async function comprobantesEnLinea(page) {
  await page.click('text=Comprobantes en línea')
  await page.waitForTimeout(3000)
}

module.exports = {
  comprobantesEnLinea,
}
