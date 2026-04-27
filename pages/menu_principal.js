const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function menuPrincipal(facturadorPage) {
  await facturadorPage.click('input[value="Menú Principal"]')
  await esperarCargaPagina(facturadorPage)
}

module.exports = {
  menuPrincipal,
}
