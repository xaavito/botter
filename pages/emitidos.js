const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function emitidos(page) {
  await page.click('text=Emitidos')
  await esperarCargaPagina(page)
}

module.exports = {
  emitidos,
}
