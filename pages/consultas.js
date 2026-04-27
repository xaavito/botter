const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function consultas(page) {
  await page.click('text=Consultas')
  await esperarCargaPagina(page)
}

module.exports = {
  consultas,
}
