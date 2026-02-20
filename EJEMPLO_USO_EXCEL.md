# Cómo usar la funcionalidad EXCEL

Esta funcionalidad te permite procesar múltiples facturas desde un archivo Excel.

## Pasos para usar:

1. **Coloca tu archivo Excel en la carpeta `data/`**
   - Solo debe haber un archivo Excel (.xlsx o .xls) en esta carpeta
   - El archivo será detectado automáticamente

2. **Formato del Excel**
   
   El archivo Excel debe tener las siguientes columnas (primera fila como encabezado):

   | Cuil emisor | Contraseña emisor | Cuil al que se le factura | monto | Modo de pago | Tipo de factura |
   |-------------|-------------------|---------------------------|-------|--------------|-----------------|
   | 3534534534  | Vvvvvvvv         | 6767676767                | 1000000 | Contado/transferencia | Aca decime vos cual va |
   | 7867867867  | Vvvvtttttt       | 121211212                 | 200000 | Contado/transferencia | Aca decime vos cual va |

   **Columnas requeridas:**
   - `Cuil emisor`: CUIT del emisor
   - `Contraseña emisor`: Contraseña del emisor
   - `Cuil al que se le factura`: CUIT del receptor de la factura
   - `monto`: Monto de la factura
   - `Modo de pago`: Forma de pago
   - `Tipo de factura`: Tipo de comprobante

3. **Ejecutar el bot**
   ```bash
   npm run botter
   ```

4. **Seleccionar la opción EXCEL** del menú

5. **El bot procesará cada fila automáticamente**
   - Mostrará el progreso fila por fila
   - Generará una factura por cada fila del Excel
   - Al finalizar mostrará un resumen de facturas generadas
   - Ejecutará el reporte de facturación mensual

## Ejemplo de salida:

```
Leyendo archivo: facturas.xlsx
Se encontraron 3 filas para procesar

--- Procesando fila 1 de 3 ---
CUIT Emisor: 3534534534
Contraseña: Vvvvvvvv
CUIT Receptor: 6767676767
Monto: 1000000
Modo de pago: Contado/transferencia
Tipo de factura: Aca decime vos cual va
✓ Fila 1 procesada exitosamente

--- Procesando fila 2 de 3 ---
...

✓ Proceso completado: 3 facturas generadas
```

## Notas importantes:

- Los nombres de las columnas deben coincidir exactamente con los especificados arriba
- Solo coloca un archivo Excel en la carpeta `data/` a la vez
- Puedes tener tantas filas como necesites en el Excel
- El proceso es secuencial: procesa una fila a la vez
- Si necesitas agregar más campos del Excel, puedes modificar el objeto `datosNomindados` en el código
