# Excel: Lectura por Orden de Columnas

## Paradigma Simplificado ✅

El Excel se lee ahora por **orden de columnas** (índices), no por nombres.

## Formato del Excel

Tu archivo Excel debe tener las columnas en este **orden exacto**:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| CUIT Emisor | Contraseña | CUIT Receptor | Monto | Modo de Pago | Tipo Factura | Descripción |
| 20123456789 | mipassword | 27987654321 | 100000 | Contado | Factura C | Servicio X |
| 20111222333 | otrapass | 27444555666 | 50000 | Transferencia | Factura A | Producto Y |

**Los nombres de los encabezados NO importan**, solo importa el **orden**.

---

## Mapeo de Columnas

El código lee las columnas por posición:

```javascript
row[0] → CUIT Emisor      (Columna A)
row[1] → Contraseña       (Columna B)
row[2] → CUIT Receptor    (Columna C)
row[3] → Monto            (Columna D)
row[4] → Modo de Pago     (Columna E)
row[5] → Tipo Factura     (Columna F)
row[6] → Descripción      (Columna G)
```

---

## Ventajas de este Enfoque

✅ **Simple** - No importa cómo nombres las columnas  
✅ **Rápido** - Acceso directo por índice  
✅ **Predecible** - Siempre sabes dónde está cada dato  
✅ **Sin ambigüedades** - No hay problemas con espacios, acentos o mayúsculas

---

## Ejemplo de Excel Válido

**Opción 1** - Con encabezados descriptivos:
```
| CUIT Emisor | Contraseña Emisor | CUIT al que se factura | Monto | Modo de pago | Tipo de factura | Descripcion |
```

**Opción 2** - Con encabezados simples:
```
| Emisor | Pass | Receptor | Importe | Pago | Tipo | Detalle |
```

**Opción 3** - Con cualquier nombre:
```
| A | B | C | D | E | F | G |
```

**✅ Las tres opciones funcionan igual** porque solo importa el **orden**, no los nombres.

---

## Logs de Debug

Al ejecutar, verás los encabezados y los datos:

```
📋 Encabezados: CUIT Emisor, Contraseña, CUIT Receptor, Monto, Modo de pago, Tipo de factura, Descripción

--- Procesando fila 1 de 2 ---
[0] CUIT Emisor: 20123456789
[1] Contraseña: ***
[2] CUIT Receptor: 27987654321
[3] Monto: 100000
[4] Modo de pago: Contado
[5] Tipo de factura: Factura C
[6] Descripción: Servicio X
✓ Fila 1 procesada exitosamente
```

Los números entre corchetes `[0], [1], [2]...` indican la posición de la columna.

---

## Cambiar el Orden de Columnas

Si tu Excel tiene un orden diferente, edita `prepararDatos()` en `excelProcessor.js`:

### Ejemplo: Tu Excel tiene este orden:
```
| Receptor | Monto | Emisor | Contraseña | Tipo | Pago | Descripción |
```

### Entonces actualiza el código así:
```javascript
prepararDatos(row) {
  const datos = {
    user: row[0],              // Columna A - Receptor
    amount: row[1],            // Columna B - Monto
    cuitEmisor: row[2],        // Columna C - Emisor
    password: row[3],          // Columna D - Contraseña
    tipoFactura: row[4],       // Columna E - Tipo
    modoPago: row[5],          // Columna F - Pago
    descripcionItem: row[6]    // Columna G - Descripción
  }
  return datos
}
```

---

## Agregar Más Columnas

Si quieres agregar más campos, simplemente agrégalos en el orden que prefieras:

```javascript
prepararDatos(row) {
  const datos = {
    cuitEmisor: row[0],
    password: row[1],
    user: row[2],
    amount: row[3],
    modoPago: row[4],
    tipoFactura: row[5],
    descripcionItem: row[6],
    // Nuevos campos
    fechaEmision: row[7],     // Columna H
    condicionVenta: row[8],   // Columna I
    observaciones: row[9]     // Columna J
  }
  return datos
}
```

Y actualiza también `logRowInfo()` para mostrarlos:

```javascript
logRowInfo(currentRow, totalRows, row) {
  logger.info(chalk.yellow(`\n--- Procesando fila ${currentRow} de ${totalRows} ---`))
  
  logger.info(chalk.cyan(`[0] CUIT Emisor: ${row[0] || 'N/A'}`))
  logger.info(chalk.cyan(`[1] Contraseña: ${row[1] ? '***' : 'N/A'}`))
  logger.info(chalk.cyan(`[2] CUIT Receptor: ${row[2] || 'N/A'}`))
  logger.info(chalk.cyan(`[3] Monto: ${row[3] || 'N/A'}`))
  logger.info(chalk.cyan(`[4] Modo de pago: ${row[4] || 'N/A'}`))
  logger.info(chalk.cyan(`[5] Tipo de factura: ${row[5] || 'N/A'}`))
  logger.info(chalk.cyan(`[6] Descripción: ${row[6] || 'N/A'}`))
  // Nuevos
  logger.info(chalk.cyan(`[7] Fecha Emisión: ${row[7] || 'N/A'}`))
  logger.info(chalk.cyan(`[8] Condición Venta: ${row[8] || 'N/A'}`))
  logger.info(chalk.cyan(`[9] Observaciones: ${row[9] || 'N/A'}`))
}
```

---

## Plantilla de Excel

Crea tu Excel con esta estructura:

| **A** | **B** | **C** | **D** | **E** | **F** | **G** |
|-------|--------|---------|--------|--------------|--------------|-------------|
| **CUIT Emisor** | **Contraseña** | **CUIT Receptor** | **Monto** | **Modo de Pago** | **Tipo Factura** | **Descripción** |
| 20123456789 | pass123 | 27987654321 | 100000 | Contado | Factura C | Concepto 1 |
| 20444555666 | pass456 | 27111222333 | 250000 | Transferencia | Factura A | Concepto 2 |

**Importante:** 
- Primera fila = encabezados (se ignoran)
- Resto de filas = datos a procesar

---

## Resumen

📝 **Orden de columnas es FIJO**  
📝 **Nombres de encabezados NO importan**  
📝 **Acceso directo por índice `row[0]`, `row[1]`, etc.**  
📝 **Modificar orden → Editar índices en `prepararDatos()`**  
📝 **Simple, rápido y predecible**
