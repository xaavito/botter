const cargarConcepto = async (page) => {
  await page.selectOption('select[name="idConcepto"]', '2')
  await page.waitForTimeout(1000)
  //TODO
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarConcepto,
}
