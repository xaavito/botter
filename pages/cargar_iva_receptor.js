const { esperarMinimo, esperarCargaPagina } = require('../helpers/waitHelpers.js')

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
    await esperarMinimo(page, 300)
    await page.fill(
      'input[name="nroDocReceptor"]',
      '' + comprobanteNominado.user
    )
    await esperarMinimo(page, 300)
    await page.click('input#formadepago1')
  } else {
    await page.selectOption('select[name="idIVAReceptor"]', CONSUMIDOR_FINAL)
    await esperarMinimo(page, 300)
    await page.click('input[name="formaDePago"]')
  }

  await esperarCargaPagina(page)
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarIVAReceptor,
}
