# Archivos Zipeados en Modo Excel

## Nueva Funcionalidad

Cuando utilizas el modo Excel para generar facturas, el sistema ahora organiza automáticamente los archivos generados de la siguiente manera:

### 📁 Estructura de Carpetas

Los archivos PDF generados se guardan en:
```
data/downloads/YYYYMMDD/
```

Donde `YYYYMMDD` es la fecha de corrida (ejemplo: `20260614` para el 14 de junio de 2026).

### 📦 Archivo ZIP

Al finalizar el proceso, todos los archivos PDF se comprimen automáticamente en un único archivo ZIP ubicado en:
```
data/downloads/facturas_YYYYMMDD.zip
```

### 🎯 Beneficios

1. **Organización por fecha**: Cada corrida tiene su propia carpeta con la fecha
2. **Fácil distribución**: Un solo archivo ZIP con todas las facturas
3. **Respaldo automático**: Los archivos originales permanecen en su carpeta
4. **Trazabilidad**: Puedes identificar fácilmente las facturas por fecha de generación

### 📋 Ejemplo de Uso

1. Coloca tu archivo Excel en la carpeta `data/`
2. Ejecuta el bot y selecciona la opción EXCEL
3. El bot procesará todas las filas del Excel
4. Al finalizar:
   - Los PDFs estarán en `data/downloads/20260614/` (una carpeta por cada archivo)
   - El ZIP estará en `data/downloads/facturas_20260614.zip` (todos los archivos juntos)

### 📊 Salida en Consola

Al finalizar el proceso verás mensajes como:

```
✓ Proceso completado: 10 facturas generadas

📦 Comprimiendo 10 archivos...
✓ Archivo ZIP creado exitosamente: /Users/tu-usuario/proyectos/botter/data/downloads/facturas_20260614.zip
✓ Total de archivos comprimidos: 10
```

### 🔧 Detalles Técnicos

- La fecha de corrida se genera automáticamente al iniciar el proceso
- El formato es YYYYMMDD (Año-Mes-Día)
- Las carpetas se crean automáticamente si no existen
- El proceso de zipeo no afecta el funcionamiento si falla (es opcional)
- Solo se incluyen archivos PDF en el ZIP

### 📝 Notas

- La carpeta individual (ej: `20260614/`) contiene los PDFs originales
- El archivo ZIP (ej: `facturas_20260614.zip`) es una copia comprimida de esos PDFs
- Puedes eliminar la carpeta individual después de verificar que el ZIP está correcto
- El ZIP facilita el envío de múltiples facturas por correo o almacenamiento
