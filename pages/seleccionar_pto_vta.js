const { TIMEOUT_FILL, TIMEOUT_NAVIGATION } = require('../helpers/constants.js')

async function seleccionarPuntoVenta(page) {
  await page.selectOption(
    'select[name="puntoDeVenta"]',
    process.env.N_PUNTO_VENTA || '1'
  )
  await page.waitForTimeout(TIMEOUT_FILL)
}

/**
 * Selecciona y presiona el botón de empresa de forma genérica
 * Busca el botón por su clase 'btn_empresa' sin depender del valor/texto
 * @param {Page} page - Instancia de la página de Playwright
 */
async function seleccionarEmpresa(page) {
  // Opción 1: Buscar por clase CSS (más genérico)
  const botonEmpresa = await page.locator('input.btn_empresa[type="button"]')

  // Verificar que el botón existe
  if ((await botonEmpresa.count()) > 0) {
    await botonEmpresa.first().click()
    await page.waitForTimeout(TIMEOUT_NAVIGATION)
  } else {
    throw new Error('No se encontró el botón de empresa')
  }
}

/**
 * Alternativa: Seleccionar empresa usando el onclick que contiene submit
 * Útil si hay múltiples botones con clase btn_empresa
 * @param {Page} page - Instancia de la página de Playwright
 */
async function seleccionarEmpresaPorSubmit(page) {
  // Buscar el botón que tiene onclick con 'seleccionaEmpresaForm.submit()'
  const botonEmpresa = await page.locator(
    'input[type="button"][onclick*="seleccionaEmpresaForm.submit()"]'
  )

  if ((await botonEmpresa.count()) > 0) {
    await botonEmpresa.first().click()
    await page.waitForTimeout(TIMEOUT_NAVIGATION)
  } else {
    throw new Error('No se encontró el botón de empresa con submit')
  }
}

module.exports = {
  seleccionarPuntoVenta,
  seleccionarEmpresa,
  seleccionarEmpresaPorSubmit,
}
