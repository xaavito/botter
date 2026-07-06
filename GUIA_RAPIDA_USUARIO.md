# 📱 GUÍA RÁPIDA - Facturador AFIP Web

## Para Usuarios SIN Conocimientos Técnicos

### 🎯 ¿Qué es esto?

Un sitio web donde puedes subir tu archivo Excel con los datos de facturación y automáticamente se generan todas las facturas en AFIP.

---

## 🚀 OPCIÓN MÁS SIMPLE (Recomendada)

### Si alguien te dio una URL (como: https://mi-facturador.railway.app)

1. **Abre esa URL en tu navegador** (Chrome, Firefox, Safari, Edge)
2. **Prepara tu archivo Excel** con este formato:

   | CUIT Emisor | Contraseña | CUIT Receptor | Monto | Modo Pago | Tipo Factura | Descripción | IVA Receptor |
   |-------------|------------|---------------|-------|-----------|--------------|-------------|--------------|
   | 20123456789 | MiClave   | 30987654321   | 100000| Contado   | Factura A    | Servicios   | Resp. Insc.  |

3. **Arrastra tu Excel** al cuadro punteado en la página
4. Haz click en **"🚀 Procesar Facturas"**
5. **Espera** - Verás una barra de progreso y cada factura procesándose
6. **¡Listo!** - Al final verás una tabla con todas las facturas generadas

---

## 💻 OPCIÓN LOCAL (Si tienes la app en tu computadora)

### Windows

1. Busca el archivo **`INICIO-WEB.bat`** en la carpeta del proyecto
2. **Haz doble click** en él
3. Espera a que aparezca un mensaje como:
   ```
   🚀 Facturador AFIP Web
   Servidor corriendo en:
   http://localhost:3000
   ```
4. **Abre tu navegador** y ve a: `http://localhost:3000`
5. Sigue los pasos del punto 2-6 de la opción anterior

### Mac

1. Abre la carpeta del proyecto
2. **Haz doble click** en el archivo `inicio-web.sh`
   - Si no funciona, abre la Terminal y escribe:
   ```bash
   cd /ruta/a/tu/carpeta/botter
   ./inicio-web.sh
   ```
3. Espera el mensaje de confirmación
4. **Abre tu navegador** y ve a: `http://localhost:3000`
5. Sigue los pasos del punto 2-6 de la primera opción

---

## 📋 FORMATO DEL EXCEL - IMPORTANTE

### Tu Excel DEBE tener estas columnas (en este orden):

1. **Columna A - CUIT Emisor**: Tu CUIT (11 números, sin guiones)
2. **Columna B - Contraseña**: Tu clave de AFIP
3. **Columna C - CUIT Receptor**: CUIT del cliente (11 números)
4. **Columna D - Monto**: Importe en números (ejemplo: 100000)
5. **Columna E - Modo de Pago**: Ejemplo: "Contado", "Transferencia"
6. **Columna F - Tipo de Factura**: Ejemplo: "Factura A", "Factura B"
7. **Columna G - Descripción**: Qué se está facturando
8. **Columna H - IVA Receptor**: "Responsable Inscripto", "Monotributo", etc.

### ⚠️ Reglas Importantes:

- ✅ La **primera fila** debe tener los títulos (se ignora automáticamente)
- ✅ El **CUIT Receptor** debe tener **exactamente 11 dígitos**
- ✅ El **Monto** debe ser solo números (sin $, comas ni puntos)
- ✅ Puedes tener filas vacías (se ignoran)

### ❌ Errores Comunes:

- ❌ CUIT con guiones: `20-12345678-9` → ✅ Correcto: `20123456789`
- ❌ Monto con símbolos: `$100.000,00` → ✅ Correcto: `100000`
- ❌ CUIT incompleto: `2012345678` → ✅ Debe tener 11 dígitos

---

## 🎬 ¿Qué verás en la pantalla?

### 1. Pantalla Inicial
- Un cuadro grande con líneas punteadas
- Instrucciones claras
- Botón "Seleccionar Archivo"

### 2. Mientras Procesa
- Una **barra de progreso** mostrando el % completado
- Un **registro en vivo** de cada factura que se va procesando
- Un **spinner** girando para confirmar que está trabajando

### 3. Resultados
- Una **tabla** con todas las facturas generadas
- **Fecha** de cada factura
- **Descripción** de qué se facturó
- **Monto** formateado con separador de miles

---

## ❓ Preguntas Frecuentes

### ¿Cuánto tarda?
Depende de cuántas facturas tengas. Aproximadamente 30-60 segundos por factura.

### ¿Puedo cerrar el navegador mientras procesa?
**NO**. Debes mantener la página abierta hasta que termine.

### ¿Los datos son seguros?
Sí. El archivo se procesa y se borra inmediatamente después. Las credenciales nunca se guardan.

### ¿Qué pasa si hay un error?
El sistema lo mostrará en rojo en el registro. Puedes corregir tu Excel y volver a intentar.

### ¿Funciona con Google Sheets?
Sí, pero primero debes **descargar como Excel** (.xlsx) desde Google Sheets.

### ¿Puedo procesar el mismo archivo dos veces?
Sí, pero **generará las facturas duplicadas**. Ten cuidado.

---

## 🆘 ¿Necesitas Ayuda?

### El sitio no carga
1. Verifica que la URL esté correcta
2. Prueba en otro navegador
3. Verifica tu conexión a internet

### Error al subir el archivo
1. Verifica que sea un archivo .xlsx o .xls
2. Revisa que tenga el formato correcto
3. Asegúrate que los CUITs tengan 11 dígitos

### Las facturas no se generan
1. Verifica tus credenciales de AFIP
2. Revisa que el CUIT receptor sea válido
3. Consulta el registro de errores (aparece en rojo)

---

## ✅ Checklist Antes de Procesar

- [ ] Mi Excel tiene las 8 columnas en el orden correcto
- [ ] Los CUITs tienen 11 dígitos (sin guiones)
- [ ] Los montos son solo números
- [ ] Mis credenciales de AFIP son correctas
- [ ] Tengo el navegador abierto y listo
- [ ] Estoy conectado a internet

---

## 🎉 ¡Listo para Empezar!

Una vez que tengas tu Excel preparado, solo necesitas:

1. 📂 **Abrir** el sitio web
2. 📤 **Subir** tu archivo
3. ⏱️ **Esperar** (mantén la página abierta)
4. ✅ **Revisar** los resultados

**¡Es así de simple!** 🚀
