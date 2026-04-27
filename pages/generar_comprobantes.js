const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function generarComprobantes(facturadorPage) {
  await facturadorPage.click('text=Generar Comprobantes')
  await esperarCargaPagina(facturadorPage)
}

module.exports = {
  generarComprobantes,
}
