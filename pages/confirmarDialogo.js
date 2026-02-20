const { TIMEOUT } = require('../helpers/constants.js')

async function confirmarDialogo(page) {
  //confirmacion
  await page.evaluate(
    () =>
      // eslint-disable-next-line no-undef
      (window.confirm = function () {
        return true
      })
  )

  // Hacer clic en el botón que contiene un span con el texto "Confirmar"
  await page.click('button:has(span:text("Confirmar"))')

  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  confirmarDialogo,
}
