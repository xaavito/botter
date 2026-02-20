const { TIMEOUT } = require('../helpers/constants.js')

const cargarIVAReceptor = async (page, comprobanteNominado = null) => {
  await page.selectOption('select[name="idIVAReceptor"]', '5')
  await page.waitForTimeout(TIMEOUT)
  if (comprobanteNominado) {
    await page.fill(
      'input[name="nroDocReceptor"]',
      '' + comprobanteNominado.user
    )
    await page.waitForTimeout(TIMEOUT)
    await page.click('input#formadepago6')
  } else {
    await page.click('input[name="formaDePago"]')
  }

  await page.waitForTimeout(TIMEOUT)
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarIVAReceptor,
}
