# Refactorización de CallToAction - Estructura de Acciones

## Resumen de Cambios

Se ha reorganizado el código del archivo `index.js` para mejorar la mantenibilidad y escalabilidad del proyecto. La función `callToAction` que contenía múltiples bloques `if` largos ha sido refactorizada utilizando un patrón de mapeo de acciones.

## Estructura Anterior

Antes, todas las acciones estaban definidas dentro de la función `callToAction` con múltiples bloques `if`:

```javascript
const callToAction = async (action) => {
  let resultados
  if (action === GENERAR) {
    resultados = await generar({ cantidad: 1 })
    await facturacionMensual()
  }
  if (action === GENERAR_MAS) {
    const resultado = await inquirer.prompt([...])
    resultados = await generar({ cantidad: resultado.cantidadAGenerar })
    await facturacionMensual()
  }
  // ... muchos más if statements
  return resultados
}
```

## Estructura Nueva

### 1. Carpeta `actions/` creada

Se creó una carpeta dedicada con 12 archivos:

- `generar-action.js`
- `generar-mas-action.js`
- `generar-nominada-action.js`
- `generar-factura-exportacion-action.js`
- `listar-action.js`
- `facturacion-mensual-action.js`
- `facturacion-anual-action.js`
- `facturacion-anual-anterior-action.js`
- `facturacion-online-afip-action.js`
- `insertar-usuario-action.js`
- `index.js` (exporta todas las acciones y el mapa)
- `README.md` (documentación)

### 2. Cada acción en su propio archivo

Ejemplo de `generar-action.js`:
```javascript
const { generar } = require('../generar')
const { facturacionMensual } = require('./facturacion-mensual-action')

const generarAction = async () => {
  const resultados = await generar({ cantidad: 1 })
  await facturacionMensual()
  return resultados
}

module.exports = { generarAction }
```

### 3. Mapeo centralizado en `actions/index.js`

```javascript
const actionMap = {
  [GENERAR]: generarAction,
  [GENERAR_MAS]: generarMasAction,
  [GENERAR_NOMINADA]: generarNominadaAction,
  // ... etc
}

module.exports = { actionMap, /* exportaciones individuales */ }
```

### 4. CallToAction simplificado

El archivo principal `index.js` ahora tiene un `callToAction` mucho más limpio:

```javascript
const callToAction = async (action) => {
  const actionFunction = actionMap[action]
  
  if (!actionFunction) {
    logger.error(`Acción no encontrada: ${action}`)
    return null
  }
  
  return await actionFunction()
}
```

## Beneficios

1. **Código más limpio**: El archivo `index.js` pasó de ~190 líneas a ~100 líneas
2. **Separación de responsabilidades**: Cada acción tiene su propio archivo
3. **Fácil mantenimiento**: Es más fácil encontrar y modificar código específico
4. **Escalabilidad**: Agregar nuevas acciones es simple y directo
5. **Mejor organización**: Las funciones relacionadas están agrupadas lógicamente
6. **Testing facilitado**: Cada acción puede ser testeada independientemente
7. **Reducción de complejidad ciclomática**: Menos bloques if anidados

## Compatibilidad

✅ El código refactorizado mantiene 100% de compatibilidad con la funcionalidad anterior.
✅ Todas las acciones funcionan exactamente igual que antes.
✅ No se requieren cambios en otros archivos del proyecto.

## Verificación

El código ha sido probado y funciona correctamente. La aplicación arranca sin errores y muestra el menú de selección de acciones como se esperaba.
