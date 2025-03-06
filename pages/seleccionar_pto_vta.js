const { TIMEOUT } = require('../constants.js')

async function seleccionarPuntoVenta(page) {
  await page.selectOption(
    'select[name="puntoDeVenta"]',
    process.env.N_PUNTO_VENTA || '1'
  )
  await page.waitForTimeout(TIMEOUT)
}

module.exports = {
  seleccionarPuntoVenta,
}
