# Actions - Estructura de Acciones

Esta carpeta contiene todas las acciones organizadas en archivos separados para mejor mantenibilidad del código.

## Estructura

Cada acción del sistema está en su propio archivo:

- **generar-action.js** - Genera una factura simple
- **generar-mas-action.js** - Genera múltiples facturas
- **generar-nominada-action.js** - Genera factura nominada
- **generar-factura-exportacion-action.js** - Genera factura de exportación
- **listar-action.js** - Lista facturas
- **facturacion-mensual-action.js** - Muestra facturación mensual
- **facturacion-anual-action.js** - Muestra facturación anual
- **facturacion-anual-anterior-action.js** - Muestra facturación del año anterior
- **facturacion-online-afip-action.js** - Descarga facturación online desde AFIP
- **insertar-usuario-action.js** - Inserta un nuevo usuario
- **index.js** - Archivo central que exporta todas las acciones y el mapa de acciones

## Cómo funciona

El archivo `index.js` exporta un `actionMap` que mapea cada constante de acción a su función correspondiente:

```javascript
const actionMap = {
  [GENERAR]: generarAction,
  [GENERAR_MAS]: generarMasAction,
  // ... etc
}
```

El archivo principal `../index.js` utiliza este mapa para ejecutar la acción correspondiente:

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

## Ventajas de esta estructura

1. **Separación de responsabilidades** - Cada acción tiene su propio archivo
2. **Fácil mantenimiento** - Más fácil encontrar y modificar código específico
3. **Escalabilidad** - Agregar nuevas acciones es simple
4. **Código más limpio** - El archivo principal (index.js) está mucho más ordenado
5. **Testing** - Cada acción puede ser testeada independientemente

## Agregar una nueva acción

1. Crear un nuevo archivo en `actions/` (ej: `mi-nueva-action.js`)
2. Implementar la función y exportarla
3. Importar la función en `actions/index.js`
4. Agregar la acción al `actionMap`
5. Agregar la constante correspondiente en `constants.js` si es necesario
