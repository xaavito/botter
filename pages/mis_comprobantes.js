const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function misComprobantes(page) {
  await page.click('text=MIS COMPROBANTES')
  await esperarCargaPagina(page)
}

module.exports = {
  misComprobantes,
}
