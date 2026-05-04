const { TIMEOUT_FILL, TIMEOUT_CLICK } = require('../helpers/constants.js')

// por ahora lo dejamos en contado y ya
const CONTADO = 1
const TRANSFERENCIA = 6

// resto
const CONSUMIDOR_FINAL = '5' // Consumidor final
// excel
const MONOTRIBUTO = '6' // Responsable Monotributista
const RRII = '1' //Responsable Inscripto

const cargarIVAReceptor = async (page, comprobanteNominado = null) => {
  if (comprobanteNominado) {
    const ivaReceptor =
      comprobanteNominado.ivaReceptor === 'M' ? MONOTRIBUTO : RRII
    await page.selectOption('select[name="idIVAReceptor"]', ivaReceptor)
    await page.waitForTimeout(TIMEOUT_FILL)
    await page.fill(
      'input[name="nroDocReceptor"]',
      '' + comprobanteNominado.user
    )
    await page.waitForTimeout(TIMEOUT_FILL)
    await page.click('input#formadepago1')
  } else {
    await page.selectOption('select[name="idIVAReceptor"]', CONSUMIDOR_FINAL)
    await page.waitForTimeout(TIMEOUT_FILL)
    await page.click('input[name="formaDePago"]')
  }

  await page.waitForTimeout(TIMEOUT_CLICK)
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarIVAReceptor,
}
