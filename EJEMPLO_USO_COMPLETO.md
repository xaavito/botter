# Ejemplo de uso completo: Iterar tabla y guardar a CSV

## Integración en listarOnline.js

```javascript
const { iterarTablaJigRapido } = require('./pages/iterar_tabla.js')
const { saveToFacturacion } = require('./helper.js')

async function listarOnline() {
  let resultados = []
  
  // ... código existente hasta buscar ...
  
  await buscar(facturadorPage)
  
  // Iterar sobre la tabla con clase 'jig_table'
  const rows = await iterarTablaJigRapido(facturadorPage)
  
  // Convertir de objeto a array de arrays (solo los valores de cells)
  const datosParaCSV = rows.map(row => row.cells)
  
  // Guardar a CSV
  saveToFacturacion(datosParaCSV)
  
  // O con nombre personalizado:
  // saveToFacturacion(datosParaCSV, 'mis-facturas')
  
  return datosParaCSV
}
```

## Si necesitas filtrar los datos antes de guardar

```javascript
const { iterarTablaJigBody } = require('./pages/iterar_tabla.js')
const { saveToFacturacion } = require('./helper.js')

async function listarOnline() {
  await buscar(facturadorPage)
  
  // Obtener solo los rows del body (sin headers)
  const rows = await iterarTablaJigBody(facturadorPage)
  
  // Convertir a array de arrays
  const datosParaCSV = rows.map(row => row.cells)
  
  // Filtrar si es necesario (ejemplo: solo facturas mayores a 1000)
  const datosFiltrados = datosParaCSV.filter(row => {
    // Asumiendo que el monto está en la columna 3
    const monto = parseFloat(row[2]?.replace(/[^\d.-]/g, '') || 0)
    return monto > 1000
  })
  
  // Guardar a CSV
  saveToFacturacion(datosFiltrados)
  
  return datosFiltrados
}
```

## Si necesitas transformar los datos antes de guardar

```javascript
const { iterarTablaJigRapido } = require('./pages/iterar_tabla.js')
const { saveToFacturacion } = require('./helper.js')

async function listarOnline() {
  await buscar(facturadorPage)
  
  const rows = await iterarTablaJigRapido(facturadorPage)
  
  // Transformar datos (ejemplo: limpiar y formatear)
  const datosTransformados = rows.map(row => {
    return row.cells.map(cell => {
      // Limpiar espacios extras
      return cell ? cell.trim() : ''
    })
  })
  
  // Guardar a CSV
  saveToFacturacion(datosTransformados)
  
  return datosTransformados
}
```

## Manejo de múltiples tablas

```javascript
const { iterarTablaJigRapido } = require('./pages/iterar_tabla.js')
const { saveToFacturacion } = require('./helper.js')

async function listarOnline() {
  await buscar(facturadorPage)
  
  // Si hay múltiples tablas, puedes especificar un selector más específico
  // Modificando la función o usando evaluate directamente:
  
  const tabla1 = await facturadorPage.evaluate(() => {
    /* global document */
    const tabla = document.querySelectorAll('.jig_table')[0] // Primera tabla
    if (!tabla) return []
    const rows = Array.from(tabla.querySelectorAll('tr'))
    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td, th'))
      return cells.map(cell => cell.textContent.trim())
    })
  })
  
  const tabla2 = await facturadorPage.evaluate(() => {
    /* global document */
    const tabla = document.querySelectorAll('.jig_table')[1] // Segunda tabla
    if (!tabla) return []
    const rows = Array.from(tabla.querySelectorAll('tr'))
    return rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td, th'))
      return cells.map(cell => cell.textContent.trim())
    })
  })
  
  // Guardar cada tabla por separado
  saveToFacturacion(tabla1, 'tabla1')
  saveToFacturacion(tabla2, 'tabla2')
  
  return { tabla1, tabla2 }
}
```

## Ejemplo completo con validaciones

```javascript
const { iterarTablaJigBody } = require('./pages/iterar_tabla.js')
const { saveToFacturacion } = require('./helper.js')

async function listarOnline() {
  let resultados = []
  const browser = await playwright.chromium.launch({ headless: false })
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()

  try {
    await login(page)
    await verTodos(page)
    await comprobantesEnLinea(page)

    let pages = await context.pages()
    const facturadorPage = pages[1]

    await miPagina(facturadorPage)
    await consultas(facturadorPage)
    await seleccionarFechaDesde(facturadorPage)
    await buscar(facturadorPage)

    // Esperar a que la tabla esté visible
    await facturadorPage.waitForSelector('.jig_table', { timeout: 10000 })

    // Obtener los datos de la tabla
    const rows = await iterarTablaJigBody(facturadorPage)
    
    if (rows.length === 0) {
      // eslint-disable-next-line no-console
      console.log('No se encontraron resultados en la tabla')
      return []
    }

    // Convertir a array de arrays
    const datosParaCSV = rows.map(row => row.cells)

    // Guardar a CSV
    saveToFacturacion(datosParaCSV)

    resultados = datosParaCSV

    // eslint-disable-next-line no-console
    console.log(`Procesados ${resultados.length} registros`)

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error en listarOnline:', error)
  } finally {
    await browser.close()
  }

  return resultados
}
```

## Resultado esperado

Después de ejecutar, se creará un archivo CSV como:

```csv
Columna 1,Columna 2,Columna 3,Columna 4
Valor1,Valor2,,Valor4
Valor5,,Valor7,Valor8
```

Los valores `null` o `undefined` se guardarán como celdas vacías en el CSV.

## Notas importantes

1. **Array de arrays**: `saveToFacturacion` espera un array de arrays donde cada array interno representa una fila
2. **Primer elemento eliminado**: La función automáticamente elimina el primer elemento del array (asumiendo que es el header de la tabla)
3. **Valores null**: Se convierten automáticamente a strings vacíos en el CSV
4. **Headers**: Los headers se crean automáticamente como "Columna 1", "Columna 2", etc.
5. **Nombre de archivo**: Por defecto usa `${process.env.USER_CUIL}-facturacionAnual.csv`
6. **Append mode**: Si el archivo existe, agrega las nuevas líneas al final
