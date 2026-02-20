const { TIMEOUT } = require('../constants.js')

const CONTADO = 1;
const TRANSFERENCIA = 6;

const cargarIVAReceptor = async (page, comprobanteNominado = null) => {
  await page.selectOption('select[name="idIVAReceptor"]', '5')
  await page.waitForTimeout(TIMEOUT)
  if (comprobanteNominado) {
    await page.fill(
      'input[name="nroDocReceptor"]',
      '' + comprobanteNominado.user
    )
    await page.waitForTimeout(TIMEOUT)
    await page.click('input#formadepago1')
  } else {
    await page.click('input[name="formaDePago"]')
  }

  await page.waitForTimeout(TIMEOUT)
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarIVAReceptor,
}
