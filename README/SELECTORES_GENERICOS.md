# Selectores Genéricos - Guía de Uso

## Problema Original

El código original usaba selectores que dependían del valor del botón:
```javascript
await page.click('input[value="GONZALEZ JAVIER MARTIN"]')
```

**Problema:** Si el nombre cambia, el código deja de funcionar.

## Solución: Selectores Genéricos

Se implementaron **dos funciones genéricas** que no dependen del texto/valor del botón.

---

## Opción 1: `seleccionarEmpresa()` - Recomendada ⭐

Selecciona el botón usando la clase CSS `btn_empresa`.

### Uso:
```javascript
const { seleccionarEmpresa } = require('./pages/seleccionar_pto_vta.js')

// En tu código
await seleccionarEmpresa(page)
```

### Selector utilizado:
```javascript
'input.btn_empresa[type="button"]'
```

### Ventajas:
- ✅ Simple y directo
- ✅ No depende del texto del botón
- ✅ Funciona con cualquier nombre de empresa
- ✅ Si hay un solo botón con clase `btn_empresa`, lo encuentra

### Cuándo usar:
- Cuando hay un único botón de empresa en la página
- Cuando el botón tiene la clase `btn_empresa`

---

## Opción 2: `seleccionarEmpresaPorSubmit()` - Más Específica

Selecciona el botón buscando en el atributo `onclick` el texto `seleccionaEmpresaForm.submit()`.

### Uso:
```javascript
const { seleccionarEmpresaPorSubmit } = require('./pages/seleccionar_pto_vta.js')

// En tu código
await seleccionarEmpresaPorSubmit(page)
```

### Selector utilizado:
```javascript
'input[type="button"][onclick*="seleccionaEmpresaForm.submit()"]'
```

### Ventajas:
- ✅ Más específico - busca por comportamiento
- ✅ Útil si hay múltiples botones con clase `btn_empresa`
- ✅ Garantiza que se selecciona el botón que hace submit del formulario correcto
- ✅ No depende del texto del botón

### Cuándo usar:
- Cuando hay múltiples botones con clase `btn_empresa`
- Cuando quieres asegurarte de que se ejecuta el submit correcto

---

## Ejemplo HTML del Botón

```html
<input 
  type="button" 
  class="btn_empresa ui-button ui-widget ui-state-default ui-corner-all" 
  style="width:100%" 
  value="GONZALEZ JAVIER MARTIN" 
  onclick="document.getElementById('idcontribuyente').value='0';document.seleccionaEmpresaForm.submit();" 
  role="button">
```

**Partes importantes:**
- `class="btn_empresa"` → Usado por `seleccionarEmpresa()`
- `onclick="...seleccionaEmpresaForm.submit()..."` → Usado por `seleccionarEmpresaPorSubmit()`
- `value="GONZALEZ JAVIER MARTIN"` → ❌ NO usado (puede cambiar)

---

## Comparación de Métodos

| Método | Selector | Robustez | Uso |
|--------|----------|----------|-----|
| ❌ **Antiguo** | `input[value="NOMBRE"]` | Baja - Depende del texto | No recomendado |
| ✅ **seleccionarEmpresa()** | `input.btn_empresa[type="button"]` | Alta - Clase CSS | **Recomendado** |
| ✅ **seleccionarEmpresaPorSubmit()** | `input[onclick*="submit()"]` | Muy Alta - Comportamiento | Casos específicos |

---

## Ejemplo de Uso en generar.js

### Antes (si se usaba value):
```javascript
// ❌ Frágil - depende del nombre
await page.click('input[value="GONZALEZ JAVIER MARTIN"]')
```

### Después - Opción 1:
```javascript
const { seleccionarEmpresa } = require('./pages/seleccionar_pto_vta.js')

await seleccionarEmpresa(page)
```

### Después - Opción 2:
```javascript
const { seleccionarEmpresaPorSubmit } = require('./pages/seleccionar_pto_vta.js')

await seleccionarEmpresaPorSubmit(page)
```

---

## Otros Selectores Genéricos Útiles

### Por clase CSS:
```javascript
// Encuentra cualquier elemento con clase específica
await page.locator('.btn_empresa').first().click()
```

### Por atributo parcial:
```javascript
// Encuentra input cuyo onclick contenga cierto texto
await page.locator('input[onclick*="submit"]').click()
```

### Por tipo y rol:
```javascript
// Encuentra button con role específico
await page.locator('input[type="button"][role="button"]').first().click()
```

### Por posición en el DOM:
```javascript
// Encuentra el primer botón de cierta clase
await page.locator('.btn_empresa').first().click()

// Encuentra el último
await page.locator('.btn_empresa').last().click()

// Encuentra el segundo (índice 1)
await page.locator('.btn_empresa').nth(1).click()
```

---

## Manejo de Errores

Ambas funciones lanzan errores descriptivos si no encuentran el botón:

```javascript
try {
  await seleccionarEmpresa(page)
} catch (error) {
  console.error('Error al seleccionar empresa:', error.message)
  // Implementar lógica de fallback o retry
}
```

---

## Recomendación Final

Para tu caso de uso:

1. **Usa `seleccionarEmpresa()`** como primera opción
2. Si tienes problemas (múltiples botones), usa `seleccionarEmpresaPorSubmit()`
3. Ambas opciones son genéricas y no dependen del nombre que aparece en el botón

## Ventajas de este Enfoque

✅ **Código mantenible** - No necesitas actualizar el código cuando cambia el nombre  
✅ **Más robusto** - Funciona independientemente del contenido  
✅ **Reutilizable** - Las funciones se pueden usar en cualquier parte del proyecto  
✅ **Documentado** - Con JSDoc para mejor autocompletado en el IDE