const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function buscar(page) {
  await page.click('text=Buscar')
  await esperarCargaPagina(page)
}

module.exports = {
  buscar,
}
