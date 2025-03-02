const cargarIVAReceptor = async (page, comprobanteNominado = null) => {
  console.log('cargarIVAReceptor', comprobanteNominado)
  await page.selectOption('select[name="idIVAReceptor"]', '5')
  await page.waitForTimeout(1000)
  if (comprobanteNominado) {
    const [cuit, monto] = comprobanteNominado.split(' ')
    await page.fill('input[name="nroDocReceptor"]', '' + cuit)
    await page.waitForTimeout(1000)
  }

  await page.click('input[name="formaDePago"]')
  await page.waitForTimeout(1000)
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarIVAReceptor,
}
