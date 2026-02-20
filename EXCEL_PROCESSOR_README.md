# ExcelProcessor - Documentación Técnica

## Descripción

La clase `ExcelProcessor` encapsula toda la lógica para procesar archivos Excel y generar facturas en lote. Esta refactorización separa la lógica de negocio del archivo principal `index.js`, haciendo el código más mantenible y reutilizable.

## Estructura de Archivos

```
botter/
├── index.js                    # Archivo principal - ahora solo 3 líneas para Excel
├── excelProcessor.js           # Clase que maneja toda la lógica Excel
├── data/                       # Carpeta donde se colocan los archivos Excel
│   └── .gitkeep
└── EJEMPLO_USO_EXCEL.md       # Guía de usuario
```

## Clase ExcelProcessor

### Constructor

```javascript
const excelProcessor = new ExcelProcessor(dataFolderPath = 'data')
```

**Parámetros:**
- `dataFolderPath` (opcional): Ruta de la carpeta donde buscar archivos Excel. Por defecto: `'data'`

### Métodos Públicos

#### `ejecutar(generarCallback)`

Método principal que ejecuta todo el proceso: buscar, leer y procesar el archivo Excel.

**Parámetros:**
- `generarCallback`: Función que se llamará para generar cada factura

**Retorna:** Array de resultados de las facturas generadas

**Ejemplo de uso en index.js:**
```javascript
if (action === EXCEL) {
  const excelProcessor = new ExcelProcessor()
  resultados = await excelProcessor.ejecutar(generar)
  await facturacionMensual()
}
```

#### `findExcelFile()`

Busca el primer archivo Excel (.xlsx o .xls) en la carpeta especificada.

**Retorna:** Nombre del archivo Excel o `null` si no se encuentra

#### `readExcelFile()`

Lee el archivo Excel y convierte los datos a formato JSON.

**Retorna:** Array de objetos con los datos del Excel

#### `procesarFilas(generarCallback)`

Procesa cada fila del Excel e invoca el callback para generar facturas.

**Retorna:** Array de resultados

### Métodos Privados

#### `prepararDatos(row)`

Transforma una fila del Excel al formato esperado por la función `generar()`.

**Entrada (row):**
```javascript
{
  'Cuil emisor': '3534534534',
  'Contraseña emisor': 'Vvvvvvvv',
  'Cuil al que se le factura': '6767676767',
  'monto': 1000000,
  'Modo de pago': 'Contado/transferencia',
  'Tipo de factura': 'Aca decime vos cual va'
}
```

**Salida:**
```javascript
{
  user: '6767676767',
  amount: 1000000
}
```

**Nota:** Este método puede ser modificado para incluir más campos del Excel si es necesario.

#### `logRowInfo(currentRow, totalRows, row)`

Muestra información detallada de la fila que se está procesando.

## Ventajas de esta Arquitectura

### ✅ Separación de Responsabilidades
- `index.js`: Solo maneja el flujo de la aplicación
- `excelProcessor.js`: Solo maneja la lógica del Excel

### ✅ Reutilizable
La clase puede ser usada en otros archivos o scripts:
```javascript
const { ExcelProcessor } = require('./excelProcessor')
const processor = new ExcelProcessor()
await processor.ejecutar(miCallbackPersonalizado)
```

### ✅ Fácil de Testear
Cada método puede ser testeado de forma independiente:
```javascript
test('findExcelFile should return null if no file exists', () => {
  const processor = new ExcelProcessor('emptyFolder')
  expect(processor.findExcelFile()).toBeNull()
})
```

### ✅ Fácil de Extender
Para agregar nuevas funcionalidades, solo modifica la clase:
```javascript
// Agregar validación de datos
prepararDatos(row) {
  const data = {
    user: row['Cuil al que se le factura'],
    amount: row['monto']
  }
  
  if (!data.user || !data.amount) {
    throw new Error('Datos inválidos en fila')
  }
  
  return data
}
```

### ✅ Mantenible
El código está documentado con JSDoc y es fácil de entender:
```javascript
/**
 * Busca el archivo Excel en la carpeta data
 * @returns {string|null} Nombre del archivo Excel encontrado o null
 */
findExcelFile() {
  // ...
}
```

## Flujo de Ejecución

```
1. Usuario selecciona opción EXCEL en el menú
   ↓
2. Se crea instancia de ExcelProcessor
   ↓
3. excelProcessor.ejecutar(generar)
   ↓
4. findExcelFile() → Busca archivo .xlsx/.xls
   ↓
5. readExcelFile() → Lee y convierte a JSON
   ↓
6. procesarFilas(generar) → Loop por cada fila
   │
   ├─→ logRowInfo() → Muestra info de la fila
   ├─→ prepararDatos() → Transforma datos
   ├─→ generar() → Genera la factura
   └─→ Almacena resultado
   ↓
7. Retorna array de resultados
   ↓
8. Se ejecuta facturacionMensual()
```

## Personalización

### Agregar más campos del Excel

Edita el método `prepararDatos()` en `excelProcessor.js`:

```javascript
prepararDatos(row) {
  return {
    user: row['Cuil al que se le factura'],
    amount: row['monto'],
    cuitEmisor: row['Cuil emisor'],        // ← Nuevo campo
    password: row['Contraseña emisor'],     // ← Nuevo campo
    modoPago: row['Modo de pago'],          // ← Nuevo campo
    tipoFactura: row['Tipo de factura']     // ← Nuevo campo
  }
}
```

### Cambiar carpeta de datos

```javascript
const excelProcessor = new ExcelProcessor('otra_carpeta')
```

### Procesar múltiples archivos Excel

Modifica `findExcelFile()` para retornar un array:

```javascript
findAllExcelFiles() {
  const files = fs.readdirSync(dataFolder)
  return files.filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'))
}
```

## Comparación: Antes vs Después

### Antes (index.js tenía 77 líneas de código Excel)
```javascript
if (action === EXCEL) {
  const dataFolder = path.join(__dirname, 'data')
  const files = fs.readdirSync(dataFolder)
  // ... 70+ líneas más
}
```

### Después (index.js tiene solo 3 líneas)
```javascript
if (action === EXCEL) {
  const excelProcessor = new ExcelProcessor()
  resultados = await excelProcessor.ejecutar(generar)
  await facturacionMensual()
}
```

**Beneficio:** Código 96% más limpio en el archivo principal 🎉
