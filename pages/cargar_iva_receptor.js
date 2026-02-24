const { TIMEOUT } = require('../helpers/constants.js')

// por ahora lo dejamos en contado y ya

const CONTADO = 1
const TRANSFERENCIA = 6

const MONOTRIBUTO = '5'
const RRII = '1'

const cargarIVAReceptor = async (page, comprobanteNominado = null) => {
  if (comprobanteNominado) {
    const ivaReceptor = comprobanteNominado.ivaReceptor === 'M' ? MONOTRIBUTO : RRII
    await page.selectOption('select[name="idIVAReceptor"]', ivaReceptor)
    await page.waitForTimeout(TIMEOUT)
    await page.fill(
      'input[name="nroDocReceptor"]',
      '' + comprobanteNominado.user
    )
    await page.waitForTimeout(TIMEOUT)
    await page.click('input#formadepago1')
  } else {
    await page.selectOption('select[name="idIVAReceptor"]', '5')
    await page.waitForTimeout(TIMEOUT)
    await page.click('input[name="formaDePago"]')
  }

  await page.waitForTimeout(TIMEOUT)
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarIVAReceptor,
}
