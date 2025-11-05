/* global document */

/**
 * Itera sobre todos los rows (tr) de una tabla con clase 'jig_table'
 * @param {Page} page - Página de Playwright
 * @returns {Array} Array con los datos de cada row
 */
async function iterarTablaJig(page) {
  // Esperar a que la tabla esté visible
  await page.waitForSelector('.jig_table', { timeout: 10000 })

  // Obtener todos los rows usando $$ (compatible con versiones antiguas)
  const rows = await page.$$('.jig_table tr')

  // eslint-disable-next-line no-console
  console.log(`Encontrados ${rows.length} rows en la tabla`)

  const resultados = []

  // Iterar sobre cada row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    // Obtener todas las celdas (td y th) del row
    const cells = await row.$$('td, th')

    // Extraer el texto de cada celda
    const cellTexts = []
    for (const cell of cells) {
      const text = await cell.textContent()
      cellTexts.push(text.trim())
    }

    // eslint-disable-next-line no-console
    //console.log(`Row ${i}:`, cellTexts)
    resultados.push(cellTexts)
  }

  return resultados
}

/**
 * Versión alternativa usando evaluate para obtener todos los datos de una vez
 * @param {Page} page - Página de Playwright
 * @returns {Array} Array con los datos de cada row
 */
async function iterarTablaJigRapido(page) {
  // Esperar a que la tabla esté visible
  await page.waitForSelector('.jig_table', { timeout: 10000 })

  // Ejecutar JavaScript en el contexto del navegador
  const datos = await page.evaluate(() => {
    const tabla = document.querySelector('.jig_table')
    if (!tabla) return []

    const rows = Array.from(tabla.querySelectorAll('tr'))

    return rows.map((row, index) => {
      const cells = Array.from(row.querySelectorAll('td, th'))
      return {
        rowIndex: index,
        cells: cells.map((cell) => cell.textContent.trim()),
        html: row.innerHTML,
      }
    })
  })

  // eslint-disable-next-line no-console
  console.log(`Encontrados ${datos.length} rows en la tabla`)
  datos.forEach((row, i) => {
    // eslint-disable-next-line no-console
    //console.log(`Row ${i}:`, row.cells)
  })

  return datos
}

/**
 * Obtener rows con filtro específico
 * @param {Page} page - Página de Playwright
 * @param {Function} filterFn - Función para filtrar rows
 * @returns {Array} Array con los rows filtrados
 */
async function iterarTablaJigConFiltro(page, filterFn) {
  await page.waitForSelector('.jig_table', { timeout: 10000 })

  const datos = await page.evaluate(() => {
    const tabla = document.querySelector('.jig_table')
    if (!tabla) return []

    const rows = Array.from(tabla.querySelectorAll('tr'))

    return rows.map((row, index) => {
      const cells = Array.from(row.querySelectorAll('td, th'))
      return {
        rowIndex: index,
        cells: cells.map((cell) => cell.textContent.trim()),
      }
    })
  })

  // Aplicar filtro si se proporciona
  if (filterFn) {
    return datos.filter(filterFn)
  }

  return datos
}

/**
 * Obtener solo los rows del tbody (excluyendo thead)
 * @param {Page} page - Página de Playwright
 * @returns {Array} Array con los datos de cada row del body
 */
async function iterarTablaJigBody(page) {
  await page.waitForSelector('.jig_table', { timeout: 10000 })

  const datos = await page.evaluate(() => {
    const tabla = document.querySelector('.jig_table')
    if (!tabla) return []

    // Solo obtener rows del tbody
    const tbody = tabla.querySelector('tbody')
    if (!tbody) {
      // Si no hay tbody, obtener todos los tr que no estén en thead
      const rows = Array.from(tabla.querySelectorAll('tr'))
      const thead = tabla.querySelector('thead')
      const theadRows = thead ? Array.from(thead.querySelectorAll('tr')) : []

      return rows
        .filter((row) => !theadRows.includes(row))
        .map((row, index) => {
          const cells = Array.from(row.querySelectorAll('td'))
          return {
            rowIndex: index,
            cells: cells.map((cell) => cell.textContent.trim()),
          }
        })
    }

    const rows = Array.from(tbody.querySelectorAll('tr'))
    return rows.map((row, index) => {
      const cells = Array.from(row.querySelectorAll('td'))
      return {
        rowIndex: index,
        cells: cells.map((cell) => cell.textContent.trim()),
      }
    })
  })

  // eslint-disable-next-line no-console
  console.log(`Encontrados ${datos.length} rows en tbody`)
  return datos
}

module.exports = {
  iterarTablaJig,
  iterarTablaJigRapido,
  iterarTablaJigConFiltro,
  iterarTablaJigBody,
}
