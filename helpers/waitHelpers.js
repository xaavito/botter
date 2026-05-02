/**
 * Helpers para esperas inteligentes en lugar de timeouts fijos
 * Estos métodos esperan hasta que la página/elementos estén listos
 */

/**
 * Espera a que la página termine de cargar y la red esté inactiva
 * @param {Page} page - Instancia de la página de Playwright
 * @param {number} timeout - Timeout máximo en ms (default: 30000)
 */
async function esperarCargaPagina(page, timeout = 30000) {
  try {
    await page.waitForLoadState('networkidle', { timeout })
  } catch (error) {
    // Si falla, intentar con domcontentloaded como fallback
    await page.waitForLoadState('domcontentloaded', { timeout })
  }
}

/**
 * Espera a que un selector esté visible en la página
 * @param {Page} page - Instancia de la página de Playwright
 * @param {string} selector - Selector del elemento a esperar
 * @param {number} timeout - Timeout máximo en ms (default: 30000)
 */
async function esperarElemento(page, selector, timeout = 30000) {
  await page.waitForSelector(selector, { state: 'visible', timeout })
}

/**
 * Hace click en un elemento y espera a que la navegación/red se estabilice
 * @param {Page} page - Instancia de la página de Playwright
 * @param {string} selector - Selector del elemento a clickear
 * @param {number} timeout - Timeout máximo en ms (default: 30000)
 */
async function clickYEsperar(page, selector, timeout = 30000) {
  await page.click(selector)
  await esperarCargaPagina(page, timeout)
}

/**
 * Espera a que un elemento esté listo y hace click
 * Útil cuando necesitas asegurar que el elemento esté completamente cargado
 * @param {Page} page - Instancia de la página de Playwright
 * @param {string} selector - Selector del elemento
 * @param {number} timeout - Timeout máximo en ms (default: 30000)
 */
async function esperarYClick(page, selector, timeout = 30000) {
  await esperarElemento(page, selector, timeout)
  await page.click(selector)
  await esperarCargaPagina(page, timeout)
}

/**
 * Espera un tiempo mínimo (para casos donde realmente se necesita un delay)
 * Usar solo cuando las esperas inteligentes no funcionan
 * @param {Page} page - Instancia de la página de Playwright
 * @param {number} ms - Milisegundos a esperar (default: 500)
 */
async function esperarMinimo(page, ms = 500) {
  await page.waitForTimeout(ms)
}

module.exports = {
  esperarCargaPagina,
  esperarElemento,
  clickYEsperar,
  esperarYClick,
  esperarMinimo,
}
