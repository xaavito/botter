async function consultar(page) {
  await page.click('text=Consulta')
  await page.waitForTimeout(1000)
}

module.exports = {
  consultar,
}
