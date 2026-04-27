const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function verTodos(page) {
  await page.click('text=Ver todos')
  await esperarCargaPagina(page)
}

module.exports = {
  verTodos,
}
