# Búsqueda Flexible de Columnas en Excel

## Problema Resuelto

El código anterior buscaba columnas del Excel con nombres **exactos**, lo que causaba problemas cuando:
- Había espacios adicionales
- Mayúsculas/minúsculas diferentes
- Acentos o sin acentos
- Nombres similares pero no idénticos

**Ejemplo del problema:**
```javascript
// ❌ Esto fallaba si la columna se llamaba "Monto " (con espacio) o "monto" (minúscula)
row['Monto']
```

## Solución: Búsqueda Flexible

Ahora el código usa `buscarValorFlexible()` que:
✅ Ignora mayúsculas/minúsculas
✅ Quita espacios extra
✅ Ignora acentos
✅ Acepta múltiples nombres alternativos

---

## Columnas Soportadas

### 1. CUIT/CUIL a Facturar (Receptor)
Nombres aceptados:
- `Cuil a facturar`
- `CUIT a facturar`
- `Cuil al que se le factura`
- `CUIT al que se le factura`
- `Receptor`
- `Cliente`

### 2. Monto
Nombres aceptados:
- `Monto`
- `Importe`
- `Total`
- `Precio`

### 3. CUIT Emisor
Nombres aceptados:
- `Cuil emisor`
- `CUIT emisor`
- `Emisor`
- `CUIT`

### 4. Contraseña
Nombres aceptados:
- `Contraseña emisor`
- `Contraseña`
- `Password`
- `Clave`

### 5. Modo de Pago
Nombres aceptados:
- `Modo de pago`
- `Forma de pago`
- `Pago`
- `Metodo de pago`

### 6. Tipo de Factura
Nombres aceptados:
- `Tipo de factura`
- `Tipo factura`
- `Tipo`
- `Comprobante`

### 7. Descripción
Nombres aceptados:
- `Descripcion`
- `Descripción`
- `Detalle`
- `Concepto`
- `Item`

---

## Ejemplos de Uso

### Excel con diferentes nombres de columnas:

**Opción 1:**
| CUIT a facturar | monto  | CUIT emisor | contraseña |
|-----------------|--------|-------------|------------|
| 12345678901     | 100000 | 98765432109 | mipass123  |

**Opción 2:**
| Receptor    | Importe | Emisor      | Password   |
|-------------|---------|-------------|------------|
| 12345678901 | 100000  | 98765432109 | mipass123  |

**Opción 3:**
| Cliente     | Total   | CUIT        | Clave      |
|-------------|---------|-------------|------------|
| 12345678901 | 100000  | 98765432109 | mipass123  |

**✅ ¡Las tres opciones funcionan!**

---

## Características del Sistema

### 1. Debug Automático

Al leer el Excel, se muestran las columnas disponibles:

```
📋 Columnas disponibles en el Excel:
  1. "CUIT a facturar"
  2. "monto"
  3. "CUIT emisor"
  4. "Contraseña emisor"
  5. "Modo de pago"
  6. "Tipo de factura"
  7. "Descripcion"
```

### 2. Advertencias Inteligentes

Si falta una columna crítica, se muestra una advertencia:

```
⚠️  No se encontró columna para "Cuil a facturar"
⚠️  No se encontró columna para "Monto"
```

### 3. Seguridad en Logs

Las contraseñas se ocultan en los logs:

```
CUIT Emisor: 98765432109
Contraseña: ***
CUIT Receptor: 12345678901
```

### 4. Normalización Automática

La función `buscarValorFlexible()` normaliza los nombres:

```javascript
// Todos estos son considerados iguales:
"Monto"
"MONTO"
"  monto  "
"Monto "
"monto"
```

---

## Cómo Agregar Nuevos Nombres Alternativos

Si necesitas agregar más nombres alternativos para una columna, edita el método `prepararDatos()` en `excelProcessor.js`:

```javascript
prepararDatos(row) {
  const datos = {
    amount: this.buscarValorFlexible(row, [
      'Monto',
      'Importe',
      'Total',
      'Precio',
      'Valor',        // ← Agregar nuevo nombre aquí
      'Costo'         // ← O aquí
    ]),
    // ...
  }
  return datos
}
```

---

## Cómo Agregar Nuevos Campos

Para agregar un nuevo campo del Excel:

```javascript
prepararDatos(row) {
  const datos = {
    // ... campos existentes ...
    
    // Nuevo campo
    direccion: this.buscarValorFlexible(row, [
      'Direccion',
      'Dirección',
      'Domicilio',
      'Address'
    ])
  }
  return datos
}
```

---

## Ventajas de este Sistema

✅ **Flexible** - Acepta múltiples variaciones de nombres  
✅ **Robusto** - No se rompe por espacios o mayúsculas  
✅ **Debug fácil** - Muestra las columnas disponibles  
✅ **Advertencias claras** - Te avisa si falta algo importante  
✅ **Seguro** - Oculta contraseñas en logs  
✅ **Mantenible** - Fácil agregar nuevos nombres alternativos

---

## Ejemplo Completo

### Tu Excel puede tener columnas como:
- `CUIT a Facturar` (con mayúscula)
- `monto` (todo minúscula)
- `  Emisor  ` (con espacios)
- `Contraseña` (con acento)
- `Forma De Pago` (con mayúsculas mixtas)

**✅ Todo funcionará correctamente**

El sistema normalizará automáticamente:
```
"CUIT a Facturar" → "cuit a facturar"
"monto" → "monto"
"  Emisor  " → "emisor"
"Contraseña" → "contrasena"
"Forma De Pago" → "forma de pago"
```

Y encontrará coincidencias con los nombres esperados.

---

## Solución de Problemas

### Si no encuentra una columna:

1. **Ejecuta el programa** - verás las columnas disponibles en el log
2. **Compara con los nombres soportados** en este documento
3. **Si el nombre es diferente**, agrégalo a `prepararDatos()` como se explicó arriba

### Ejemplo:

Si tu Excel tiene una columna llamada "Importe Total" y no se detecta:

```javascript
amount: this.buscarValorFlexible(row, [
  'Monto',
  'Importe',
  'Total',
  'Precio',
  'Importe Total'  // ← Agregar aquí
]),
```

---

## Resumen

El sistema es ahora **mucho más tolerante** con los nombres de columnas del Excel. Ya no necesitas que los nombres sean exactos, solo que se parezcan a alguno de los nombres alternativos soportados.
