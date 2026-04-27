const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

async function confirmar(page) {
  //confirmacion
  await page.evaluate(
    () =>
      // eslint-disable-next-line no-undef
      (window.confirm = function () {
        return true
      })
  )

  await page.click('input[value="Confirmar Datos..."]')

  await esperarCargaPagina(page)
}

module.exports = {
  confirmar,
}
