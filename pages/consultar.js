const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function consultar(page) {
  await page.click('text=Consulta')
  await esperarCargaPagina(page)
}

module.exports = {
  consultar,
}
