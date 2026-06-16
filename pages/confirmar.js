const { TIMEOUT_CLICK } = require('../helpers/constants.js')

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

  await page.waitForTimeout(TIMEOUT_CLICK)
}

module.exports = {
  confirmar,
}
