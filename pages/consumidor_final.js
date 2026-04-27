const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function consumidorFinal(page) {
  await page.selectOption('select[id="tipoComprobante"]', '11')
  await esperarCargaPagina(page)
}

module.exports = {
  consumidorFinal,
}
