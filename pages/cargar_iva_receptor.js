const { TIMEOUT_FILL, TIMEOUT_CLICK } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

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
    // Operaciones consecutivas sin timeouts redundantes
    await page.selectOption('select[name="idIVAReceptor"]', ivaReceptor)
    await page.fill(
      'input[name="nroDocReceptor"]',
      '' + comprobanteNominado.user
    )
    await waitForTimeoutWithRetry(page, TIMEOUT_FILL, null, 'Cargar IVA Receptor - Fill')
    await page.click('input#formadepago1')
  } else {
    await page.selectOption('select[name="idIVAReceptor"]', CONSUMIDOR_FINAL)
    await waitForTimeoutWithRetry(page, TIMEOUT_FILL, null, 'Cargar IVA Receptor - Select')
    await page.click('input[name="formaDePago"]')
  }

  await waitForTimeoutWithRetry(page, TIMEOUT_CLICK, null, 'Cargar IVA Receptor - Click Continuar')
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarIVAReceptor,
}
