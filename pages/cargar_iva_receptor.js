async function cargarIVAReceptor(page) {
  await page.selectOption('select[name="idIVAReceptor"]', '5')
  await page.waitForTimeout(1000)
  await page.click('input[name="formaDePago"]')
  await page.click('input[value="Continuar >"]')
  await page.waitForTimeout(1000)
}

module.exports = {
  cargarIVAReceptor,
}
