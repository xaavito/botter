# Ejemplo de uso: Iterar tabla con clase 'jig_table'

## Descripción

El archivo `pages/iterar_tabla.js` proporciona 4 funciones diferentes para iterar sobre las filas de una tabla HTML con la clase 'jig_table' usando Playwright.

## Funciones disponibles

### 1. `iterarTablaJig(page)` - Básica

Itera sobre todos los rows (tr) de la tabla usando `$$` de Playwright (compatible con todas las versiones).

**Ventajas:**
- Compatible con versiones antiguas de Playwright
- Usa la API nativa de Playwright
- Más precisa para interacciones complejas

**Desventajas:**
- Más lenta que evaluate

**Retorna:** Array de arrays con el texto de cada celda

```javascript
const { iterarTablaJig } = require('./pages/iterar_tabla.js')

// En tu código:
const rows = await iterarTablaJig(page)
// Resultado: [['celda1', 'celda2'], ['celda3', 'celda4'], ...]
```

### 2. `iterarTablaJigRapido(page)` - Recomendada

Versión rápida usando `page.evaluate()` que ejecuta JavaScript en el navegador.

**Ventajas:**
- Muy rápida (todo se ejecuta en el navegador)
- Retorna más información (índice, contenido, HTML)

**Retorna:** Array de objetos con rowIndex, cells y html

```javascript
const { iterarTablaJigRapido } = require('./pages/iterar_tabla.js')

// En tu código:
const datos = await iterarTablaJigRapido(page)
// Resultado: [
//   { rowIndex: 0, cells: ['celda1', 'celda2'], html: '<td>...</td>' },
//   { rowIndex: 1, cells: ['celda3', 'celda4'], html: '<td>...</td>' }
// ]
```

### 3. `iterarTablaJigConFiltro(page, filterFn)` - Con filtro

Permite filtrar los rows según una función de filtrado.

```javascript
const { iterarTablaJigConFiltro } = require('./pages/iterar_tabla.js')

// Filtrar solo rows que contengan "Factura"
const rowsFiltrados = await iterarTablaJigConFiltro(page, (row) => {
  return row.cells.some(cell => cell.includes('Factura'))
})

// Filtrar rows por posición
const primeros5 = await iterarTablaJigConFiltro(page, (row) => {
  return row.rowIndex < 5
})
```

### 4. `iterarTablaJigBody(page)` - Solo tbody

Itera solo sobre los rows del `tbody`, excluyendo headers del `thead`.

```javascript
const { iterarTablaJigBody } = require('./pages/iterar_tabla.js')

// Solo obtener rows de datos (sin headers)
const rowsBody = await iterarTablaJigBody(page)
```

## Ejemplo completo en listarOnline.js

```javascript
const { iterarTablaJigRapido } = require('./pages/iterar_tabla.js')

async function listarOnline() {
  // ... código existente hasta que llegues a la tabla ...
  
  await buscar(facturadorPage)
  
  // Iterar sobre la tabla
  const rows = await iterarTablaJigRapido(facturadorPage)
  
  // Procesar los datos
  const resultados = rows.map(row => ({
    columna1: row.cells[0],
    columna2: row.cells[1],
    columna3: row.cells[2],
    // ... según las columnas que tenga tu tabla
  }))
  
  // eslint-disable-next-line no-console
  console.log('Resultados:', resultados)
  
  return resultados
}
```

## Ejemplo avanzado: Extraer datos específicos

```javascript
const { iterarTablaJigBody } = require('./pages/iterar_tabla.js')

async function extraerFacturas(page) {
  // Obtener solo los datos del body (sin headers)
  const rows = await iterarTablaJigBody(page)
  
  // Transformar en objetos con nombres de campos
  const facturas = rows.map(row => ({
    numero: row.cells[0],
    fecha: row.cells[1],
    cliente: row.cells[2],
    monto: parseFloat(row.cells[3].replace(/[^\d.-]/g, ''))
  }))
  
  return facturas
}
```

## Ejemplo con filtrado

```javascript
const { iterarTablaJigConFiltro } = require('./pages/iterar_tabla.js')

async function buscarFacturasPorFecha(page, fecha) {
  // Filtrar solo las facturas de una fecha específica
  const facturasFecha = await iterarTablaJigConFiltro(page, (row) => {
    // Asumiendo que la fecha está en la segunda columna (índice 1)
    return row.cells[1] === fecha
  })
  
  return facturasFecha
}

// Uso:
const facturas = await buscarFacturasPorFecha(facturadorPage, '05/11/2025')
```

## Estructura de la tabla esperada

Las funciones esperan una tabla HTML con esta estructura:

```html
<table class="jig_table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dato 1</td>
      <td>Dato 2</td>
    </tr>
    <tr>
      <td>Dato 3</td>
      <td>Dato 4</td>
    </tr>
  </tbody>
</table>
```

## Notas importantes

1. **Timeout**: Todas las funciones esperan hasta 10 segundos a que la tabla aparezca
2. **Rendimiento**: `iterarTablaJigRapido()` es la más rápida y recomendada para tablas grandes
3. **Headers**: Si necesitas excluir headers, usa `iterarTablaJigBody()`
4. **Filtrado**: Para filtrar datos, usa `iterarTablaJigConFiltro()` con una función personalizada
