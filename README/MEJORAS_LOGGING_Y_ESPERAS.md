# Mejoras en Logging y Esperas

## Cambios Implementados

### 1. 📍 Stack Trace Mejorado
**Problema:** Los errores solo mostraban el mensaje genérico sin indicar en qué archivo/línea falló.

**Solución:** 
- Nuevo método `extraerInfoError()` en `ExcelProcessor`
- Extrae automáticamente el archivo y línea del stack trace
- Filtra solo archivos relevantes (`/pages/`, `/actions/`, `/helpers/`)

**Ejemplo anterior:**
```
❌ Error en fila 14 después de 3 intentos
   Detalle: page.click: Timeout 30000ms exceeded.
```

**Ejemplo nuevo:**
```
❌ Error en fila 14 después de 3 intentos
   Detalle: page.click: Timeout 30000ms exceeded. [pages/confirmar.js:13]
```

### 2. 📊 Logs Compactos (Una Línea)
**Problema:** La información de cada fila ocupaba 7+ líneas, haciendo difícil seguir el progreso.

**Solución:**
- Método `logRowInfo()` reformateado
- Todos los datos en una sola línea separados por `|`

**Ejemplo anterior:**
```
--- Procesando fila 23 de 31 ---
[0] CUIT Emisor: 20471821897
[1] Contraseña: ***
[2] CUIT Receptor: 23172766099
[3] Monto: 286000
[4] Modo de pago: Contado
[5] Tipo de factura: C
[6] Descripción: Trabajos de pintura
✓ Factura confirmada e impresa exitosamente
✓ Fila 23 procesada exitosamente
```

**Ejemplo nuevo:**
```
--- Fila 23/31 --- Emisor: 20471821897 | Receptor: 23172766099 | Monto: 286000 | Pago: Contado | Tipo: C | Desc: Trabajos de pintura
✓ Fila 23 procesada y factura confirmada exitosamente
```

### 3. ⚡ Esperas Dinámicas (Reemplazo de Timeouts Fijos)
**Problema:** `waitForTimeout(TIMEOUT)` esperaba un tiempo fijo independientemente de si la página ya había cargado.

**Solución:**
- Nuevo módulo `helpers/waitHelpers.js` con funciones inteligentes
- Espera a que la red esté inactiva (`networkidle`) en lugar de tiempo fijo
- Fallback a `domcontentloaded` si `networkidle` falla

**Funciones disponibles:**

```javascript
// Espera a que la página termine de cargar
await esperarCargaPagina(page)

// Espera a que un elemento sea visible
await esperarElemento(page, selector)

// Click y espera automática
await clickYEsperar(page, selector)

// Espera elemento, click, y espera carga
await esperarYClick(page, selector)

// Espera mínima (solo cuando es realmente necesario)
await esperarMinimo(page, 500)
```

**Archivos actualizados:**
- ✅ `pages/comprobantes_en_linea.js`
- ✅ `pages/generar_comprobantes.js`
- ✅ `pages/continuar.js`
- ✅ `pages/confirmar.js`
- ✅ `pages/menu_principal.js`

**Beneficios:**
- ⚡ Más rápido: No espera tiempo innecesario
- 🎯 Más confiable: Espera hasta que realmente esté listo
- 🔧 Configurable: Timeout máximo ajustable (default 30s)

## Archivos Creados/Modificados

### Nuevos archivos:
- `helpers/waitHelpers.js` - Helpers para esperas inteligentes

### Archivos modificados:
- `helpers/excelProcessor.js` - Logs compactos + extracción de stack trace
- `pages/comprobantes_en_linea.js` - Esperas dinámicas
- `pages/generar_comprobantes.js` - Esperas dinámicas
- `pages/continuar.js` - Esperas dinámicas
- `pages/confirmar.js` - Esperas dinámicas
- `pages/menu_principal.js` - Esperas dinámicas

## Validaciones Agregadas (del request anterior)

### ✅ Validación CUIL/CUIT (11 caracteres)
- Valida que el CUIT receptor tenga exactamente 11 caracteres
- Se ejecuta ANTES de procesar cada fila
- No hace reintentos en errores de validación

### ✅ Validación "Comprobantes en línea" (por usuario)
- Verifica permisos AFIP por usuario
- No detiene el proceso completo
- Continúa con siguiente usuario si falla
- No reintenta errores de permisos
