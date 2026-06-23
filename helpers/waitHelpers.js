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

/**
 * Ejecuta una acción con reintentos automáticos y timeout dinámico
 * Si la acción falla, reintenta incrementando el timeout en 20% y luego 40%
 * 
 * @param {Function} action - Función async a ejecutar (debe incluir el waitForTimeout dentro)
 * @param {Page} page - Instancia de la página de Playwright
 * @param {number} baseTimeout - Timeout base en ms
 * @param {string} actionName - Nombre de la acción para logging (opcional)
 * @returns {Promise} Resultado de la acción
 * @throws {Error} Si falla después de los 3 intentos
 */
async function executeWithDynamicTimeout(action, page, baseTimeout, actionName = 'Acción') {
  const attempts = [
    { multiplier: 1.0, label: 'inicial' },
    { multiplier: 1.2, label: 'reintento con +20%' },
    { multiplier: 1.4, label: 'reintento con +40%' }
  ]

  let lastError = null

  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i]
    const currentTimeout = Math.round(baseTimeout * attempt.multiplier)

    try {
      console.log(`[Timeout Dinámico] ${actionName} - Intento ${i + 1}/${attempts.length} (${attempt.label}: ${currentTimeout}ms)`)
      
      // Ejecutar la acción con el timeout actual
      const result = await action(currentTimeout)
      
      if (i > 0) {
        console.log(`[Timeout Dinámico] ✓ ${actionName} exitosa en intento ${i + 1}`)
      }
      
      return result
    } catch (error) {
      lastError = error
      console.log(`[Timeout Dinámico] ✗ ${actionName} falló en intento ${i + 1}: ${error.message}`)
      
      // Si es el último intento, lanzar el error
      if (i === attempts.length - 1) {
        console.error(`[Timeout Dinámico] ✗✗✗ ${actionName} falló después de ${attempts.length} intentos`)
        throw error
      }
      
      // Esperar un poco antes del siguiente intento
      await page.waitForTimeout(200)
    }
  }

  // Esto no debería alcanzarse, pero por si acaso
  throw lastError
}

/**
 * Wrapper para waitForTimeout con reintentos automáticos
 * Ejecuta una acción después de esperar, con reintentos si falla
 * 
 * @param {Page} page - Instancia de la página de Playwright
 * @param {number} baseTimeout - Timeout base en ms
 * @param {Function} actionAfterWait - Función a ejecutar después del timeout (opcional)
 * @param {string} actionName - Nombre de la acción para logging (opcional)
 * @returns {Promise}
 */
async function waitForTimeoutWithRetry(page, baseTimeout, actionAfterWait = null, actionName = 'Espera') {
  if (!actionAfterWait) {
    // Si no hay acción después, solo esperar con reintentos en caso de error
    return executeWithDynamicTimeout(
      async (timeout) => {
        await page.waitForTimeout(timeout)
      },
      page,
      baseTimeout,
      actionName
    )
  }

  // Si hay una acción después del timeout, ejecutarla con reintentos
  return executeWithDynamicTimeout(
    async (timeout) => {
      await page.waitForTimeout(timeout)
      return await actionAfterWait()
    },
    page,
    baseTimeout,
    actionName
  )
}

module.exports = {
  esperarCargaPagina,
  esperarElemento,
  clickYEsperar,
  esperarYClick,
  esperarMinimo,
  executeWithDynamicTimeout,
  waitForTimeoutWithRetry,
}
