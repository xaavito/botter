# 🔄 Sistema de Timeout Dinámico con Reintentos Automáticos

## 📋 Descripción

Este sistema implementa un manejo inteligente de timeouts con reintentos automáticos. Si una acción falla después de un `waitForTimeout`, el sistema **reintenta automáticamente** incrementando el tiempo de espera:

- **1er intento**: Timeout base (100%)
- **2do intento**: Timeout + 20% (si falla el primero)
- **3er intento**: Timeout + 40% (si falla el segundo)

Si después de los 3 intentos sigue fallando, entonces lanza el error.

---

## 🎯 ¿Por qué usar esto?

En lugar de escribir código repetitivo como:

```javascript
// ❌ ANTES - Código repetitivo y propenso a errores
try {
  await page.waitForTimeout(800)
  // hacer algo
} catch (error) {
  try {
    await page.waitForTimeout(960) // +20%
    // hacer algo
  } catch (error) {
    await page.waitForTimeout(1120) // +40%
    // hacer algo
  }
}
```

Ahora puedes hacer:

```javascript
// ✅ AHORA - Simple y automático
await waitForTimeoutWithRetry(page, 800, null, 'Mi Acción')
```

---

## 📚 Funciones Disponibles

### 1. `waitForTimeoutWithRetry(page, baseTimeout, actionAfterWait, actionName)`

La función principal para usar timeouts con reintentos automáticos.

**Parámetros:**
- `page`: Instancia de la página de Playwright
- `baseTimeout`: Tiempo base en milisegundos
- `actionAfterWait`: (Opcional) Función a ejecutar después del timeout
- `actionName`: (Opcional) Nombre descriptivo para logs

**Ejemplo básico:**
```javascript
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')
const { TIMEOUT_NAVIGATION } = require('../helpers/constants.js')

// Solo esperar con reintentos
await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Carga de página')
```

### 2. `executeWithDynamicTimeout(action, page, baseTimeout, actionName)`

Función de nivel más bajo para ejecutar cualquier acción con reintentos.

**Parámetros:**
- `action`: Función async que recibe el timeout actual como parámetro
- `page`: Instancia de la página de Playwright
- `baseTimeout`: Tiempo base en milisegundos
- `actionName`: (Opcional) Nombre descriptivo para logs

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Reemplazo Simple de `waitForTimeout`

```javascript
// ❌ ANTES
await page.waitForTimeout(TIMEOUT_NAVIGATION)

// ✅ AHORA
await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Navegación')
```

### Ejemplo 2: Timeout + Acción después

```javascript
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

async function seleccionarEmpresa(page) {
  const boton = await page.locator('input.btn_empresa')
  
  if ((await boton.count()) > 0) {
    await boton.first().click()
    
    // Esperar con reintentos automáticos
    await waitForTimeoutWithRetry(
      page,
      TIMEOUT_NAVIGATION,
      null,
      'Seleccionar Empresa'
    )
  }
}
```

### Ejemplo 3: Ejecutar acción después del timeout

```javascript
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')

// Esperar y luego verificar algo
await waitForTimeoutWithRetry(
  page,
  800,
  async () => {
    // Esta función se ejecuta después del timeout
    // Si falla, todo se reintenta con más tiempo
    const elemento = await page.locator('#resultado')
    if (!(await elemento.isVisible())) {
      throw new Error('Elemento no visible')
    }
  },
  'Verificar resultado'
)
```

### Ejemplo 4: Usando `executeWithDynamicTimeout` para casos complejos

```javascript
const { executeWithDynamicTimeout } = require('../helpers/waitHelpers.js')

// Para acciones más complejas donde necesitas control total
await executeWithDynamicTimeout(
  async (currentTimeout) => {
    // currentTimeout será 800, luego 960, luego 1120
    await page.waitForTimeout(currentTimeout)
    
    // Hacer múltiples cosas después
    await page.click('#boton')
    await page.fill('#input', 'valor')
    
    // Si cualquiera falla, se reintenta todo con más tiempo
    const resultado = await page.textContent('#resultado')
    if (!resultado.includes('éxito')) {
      throw new Error('No se encontró el resultado esperado')
    }
    
    return resultado
  },
  page,
  800,
  'Proceso complejo'
)
```

### Ejemplo 5: Múltiples acciones con timeouts

```javascript
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')
const { TIMEOUT_FILL, TIMEOUT_NAVIGATION } = require('../helpers/constants.js')

async function llenarFormulario(page) {
  // Llenar campo 1
  await page.fill('#nombre', 'Juan')
  await waitForTimeoutWithRetry(page, TIMEOUT_FILL, null, 'Campo nombre')
  
  // Llenar campo 2
  await page.fill('#email', 'juan@example.com')
  await waitForTimeoutWithRetry(page, TIMEOUT_FILL, null, 'Campo email')
  
  // Enviar formulario
  await page.click('#submit')
  await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Envío formulario')
}
```

---

## 🔍 Salida de Logs

Cuando usas estas funciones, verás logs descriptivos:

```
[Timeout Dinámico] Seleccionar Empresa - Intento 1/3 (inicial: 800ms)
[Timeout Dinámico] ✗ Seleccionar Empresa falló en intento 1: Timeout exceeded
[Timeout Dinámico] Seleccionar Empresa - Intento 2/3 (reintento con +20%: 960ms)
[Timeout Dinámico] ✓ Seleccionar Empresa exitosa en intento 2
```

---

## ⚙️ Configuración de Timeouts

Los timeouts base están definidos en `helpers/constants.js`:

```javascript
export const TIMEOUT_CLICK = 400      // Para clicks simples
export const TIMEOUT_FILL = 200       // Para llenar campos
export const TIMEOUT_NAVIGATION = 800 // Para navegación
```

Con el sistema de reintentos:
- `TIMEOUT_CLICK` (400ms) → 400ms, 480ms, 560ms
- `TIMEOUT_FILL` (200ms) → 200ms, 240ms, 280ms
- `TIMEOUT_NAVIGATION` (800ms) → 800ms, 960ms, 1120ms

---

## 🚀 Migración de Código Existente

### Paso 1: Identificar `waitForTimeout`
Busca en tu código todos los usos de `page.waitForTimeout()`:

```bash
grep -r "waitForTimeout" pages/
```

### Paso 2: Importar la función
```javascript
const { waitForTimeoutWithRetry } = require('../helpers/waitHelpers.js')
```

### Paso 3: Reemplazar
```javascript
// ❌ Antes
await page.waitForTimeout(TIMEOUT_NAVIGATION)

// ✅ Después
await waitForTimeoutWithRetry(page, TIMEOUT_NAVIGATION, null, 'Nombre de la acción')
```

---

## 📊 Ventajas

1. **Menos código**: No necesitas escribir try-catch anidados
2. **Más robusto**: Reintentos automáticos ante fallos temporales
3. **Mejor debugging**: Logs claros de cada intento
4. **Configurable**: Fácil ajustar los porcentajes de incremento
5. **Consistente**: Mismo comportamiento en toda la aplicación

---

## ⚠️ Consideraciones

1. **No abuses**: Solo usar cuando realmente necesites `waitForTimeout`
2. **Prefiere esperas inteligentes**: Usa `waitForSelector`, `waitForLoadState` cuando sea posible
3. **Nombres descriptivos**: Siempre pasa un `actionName` para facilitar debugging
4. **Timeouts razonables**: No uses timeouts muy largos (máximo 2-3 segundos)

---

## 🔧 Personalización

Si necesitas cambiar los porcentajes de incremento, edita `executeWithDynamicTimeout` en `helpers/waitHelpers.js`:

```javascript
const attempts = [
  { multiplier: 1.0, label: 'inicial' },
  { multiplier: 1.2, label: 'reintento con +20%' },  // Cambiar a 1.3 para +30%
  { multiplier: 1.4, label: 'reintento con +40%' }   // Cambiar a 1.5 para +50%
]
```

---

## 📝 Resumen

- ✅ Usa `waitForTimeoutWithRetry` para todos los `waitForTimeout`
- ✅ Siempre pasa un nombre descriptivo
- ✅ Los reintentos son automáticos (+20%, +40%)
- ✅ Logs claros para debugging
- ✅ Código más limpio y robusto
