const { TIMEOUT_CLICK, TIMEOUT_NAVIGATION } = require('../helpers/constants.js')
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function confirmarDialogo(page) {
  //confirmacion
  await page.evaluate(
    () =>
      // eslint-disable-next-line no-undef
      (window.confirm = function () {
        return true
      })
  )

  // Esperar a que la página cargue antes de buscar el botón
  await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Confirmar Diálogo - Esperar Página')
  
  // Hacer clic en el botón que contiene un span con el texto "Confirmar"
  await page.click('button:has(span:text("Confirmar"))')

  await waitForTimeoutWithRetry(page, TIMEOUT_CLICK, null, 'Confirmar Diálogo - Después Click')
}

module.exports = {
  confirmarDialogo,
}
