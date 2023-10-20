async function consumidorFinal(page) {
  await page.selectOption('select[id="tipoComprobante"]', '11')
  await page.waitForTimeout(1000)
}

module.exports = {
  consumidorFinal,
}
