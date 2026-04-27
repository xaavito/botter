const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function continuar(page) {
  await page.click('input[value="Continuar >"]')
  await esperarCargaPagina(page)
}

module.exports = {
  continuar,
}
