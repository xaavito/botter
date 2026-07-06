# 🌐 Interfaz Web para Facturador AFIP

## 📋 Descripción

Esta interfaz web permite a usuarios **SIN conocimientos técnicos** utilizar el facturador AFIP simplemente subiendo un archivo Excel a través del navegador.

## ✨ Características

- ✅ **Interfaz visual moderna** - No necesitas usar la terminal
- ✅ **Drag & Drop** - Arrastra tu archivo Excel y suéltalo
- ✅ **Progreso en tiempo real** - Ve cada factura generándose en vivo
- ✅ **Barra de progreso** - Visualiza cuántas facturas se procesaron
- ✅ **Resultados detallados** - Tabla con todas las facturas generadas
- ✅ **Sin instalación** - Solo navegador web (opción en la nube)

## 🚀 Opción 1: Uso Local (Tu Computadora)

### Requisitos Previos
- Node.js instalado (si no lo tienes: https://nodejs.org)
- Git para clonar el proyecto (opcional)

### Pasos de Instalación

1. **Instalar dependencias** (solo la primera vez):
```bash
npm install
```

2. **Iniciar el servidor**:

**En Windows:**
- Hacer doble click en `INICIO-WEB.bat`

**En Mac/Linux:**
```bash
chmod +x inicio-web.sh
./inicio-web.sh
```

**O usando npm:**
```bash
npm start
```

3. **Abrir el navegador**:
- Ve a: `http://localhost:3000`

### Uso

1. Abre `http://localhost:3000` en tu navegador
2. Verás instrucciones del formato Excel requerido
3. **Arrastra tu archivo Excel** al área punteada (o haz click para seleccionar)
4. Haz click en **"🚀 Procesar Facturas"**
5. Observa el progreso en tiempo real
6. Al finalizar, verás una tabla con todas las facturas generadas

## ☁️ Opción 2: Deployment en la Nube (RECOMENDADO)

Con esta opción, el usuario **NO necesita instalar NADA**, solo una URL.

### Deployment en Railway (Gratis)

Railway ofrece un plan gratuito que es perfecto para este proyecto.

#### Paso 1: Preparar el Proyecto

1. Asegúrate de tener un archivo `.gitignore` que excluya:
```
node_modules/
.env
data/*.xlsx
data/*.xls
data/*.csv
invoices/
```

2. Commit y push a GitHub:
```bash
git add .
git commit -m "Add web interface"
git push origin main
```

#### Paso 2: Crear Cuenta en Railway

1. Ve a https://railway.app
2. Haz click en "Start a New Project"
3. Conecta tu cuenta de GitHub
4. Selecciona "Deploy from GitHub repo"
5. Selecciona tu repositorio `botter`

#### Paso 3: Configurar Variables de Entorno

En Railway, ve a la pestaña "Variables" y agrega:

```
USER_CUIL=tu_cuil_aqui
USER_PASS=tu_contraseña_aqui
USER_NAME=TU_NOMBRE_AFIP
TOPE_FACTURA=205000
N_PUNTO_VENTA=1
PORCENTAJES_FACTURACION=["10","15","5","20"]
DETALLES=["Actualización Servidor.","Actualización Cliente."]
CHROME=false
PORT=3000
```

#### Paso 4: Deploy

1. Railway detectará automáticamente que es un proyecto Node.js
2. Usará el comando `npm start` (ya configurado en package.json)
3. En unos minutos, tu app estará en línea
4. Railway te dará una URL tipo: `https://botter-production-xxxx.up.railway.app`

#### Paso 5: Compartir con el Usuario

Simplemente envía la URL al usuario:
```
https://tu-app.up.railway.app
```

**El usuario solo necesita:**
1. Abrir esa URL en cualquier navegador
2. Subir su Excel
3. ¡Listo!

### Deployment en Render (Alternativa Gratuita)

1. Ve a https://render.com
2. Crea una cuenta
3. Click en "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configuración:
   - **Name:** botter-afip
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Agrega las variables de entorno (.env)
7. Click en "Create Web Service"

Render te dará una URL como: `https://botter-afip.onrender.com`

## 📝 Formato del Archivo Excel

El Excel debe tener las siguientes columnas (en este orden):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| CUIT Emisor | Contraseña | CUIT Receptor | Monto | Modo Pago | Tipo Factura | Descripción | IVA Receptor |

**Ejemplo:**

| CUIT Emisor | Contraseña | CUIT Receptor | Monto | Modo Pago | Tipo Factura | Descripción | IVA Receptor |
|-------------|------------|---------------|-------|-----------|--------------|-------------|--------------|
| 20123456789 | MiPass123 | 30987654321 | 100000 | Contado | Factura A | Servicios de consultoría | Responsable Inscripto |
| 20123456789 | MiPass123 | 27456789012 | 50000 | Transferencia | Factura B | Desarrollo web | Monotributo |

### Notas Importantes:

1. **Primera fila:** Debe contener los encabezados (se ignora automáticamente)
2. **CUIT Receptor:** Debe tener exactamente 11 dígitos (sin guiones)
3. **Monto:** Solo números, sin símbolos ($, puntos, comas)
4. **Filas vacías:** Se ignoran automáticamente

## 🔒 Seguridad

### Para Deployment Local:
- Las credenciales se leen del archivo `.env`
- El archivo nunca se sube a GitHub

### Para Deployment en la Nube:
- Usa las variables de entorno de Railway/Render
- **NUNCA** hagas commit del archivo `.env`
- Las credenciales están encriptadas en el servidor

## 🎨 Interfaz de Usuario

### Pantalla Principal
- **Área de carga:** Zona de drag & drop con diseño moderno
- **Instrucciones:** Formato del Excel claramente visible
- **Validación:** Solo acepta archivos .xlsx, .xls, .csv

### Durante el Procesamiento
- **Spinner:** Animación mientras procesa
- **Barra de progreso:** % completado en tiempo real
- **Log en vivo:** Cada fila procesada se muestra instantáneamente
- **Información detallada:** Emisor, receptor, monto de cada factura

### Resultados
- **Tabla de resultados:** Fecha, detalle y monto de cada factura
- **Contador:** Total de facturas generadas
- **Formato moneda:** Montos con separador de miles

## 🛠️ Solución de Problemas

### El servidor no inicia
```bash
# Verificar que las dependencias estén instaladas
npm install

# Verificar que el puerto 3000 esté libre
# En Mac/Linux:
lsof -ti:3000 | xargs kill -9

# En Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_del_proceso] /F
```

### Error al subir archivo
- Verifica que el archivo sea .xlsx, .xls o .csv
- Asegúrate que el formato de columnas sea correcto
- Verifica que los CUITs tengan 11 dígitos

### No se ven las facturas
- Revisa los logs en la consola del servidor
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate que el CUIT receptor sea válido

## 🌟 Ventajas vs CLI

| Característica | CLI (Terminal) | Web Interface |
|----------------|---------------|---------------|
| Conocimientos técnicos | ✅ Requeridos | ❌ No necesarios |
| Interfaz visual | ❌ No | ✅ Sí |
| Progreso en tiempo real | ⚠️ Solo texto | ✅ Visual + barra |
| Facilidad de uso | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Acceso remoto | ❌ No | ✅ Sí (en la nube) |
| Instalación | Compleja | Simple/Ninguna |

## 📞 Soporte

Si tienes problemas:
1. Revisa esta documentación
2. Verifica los logs del servidor
3. Abre un issue en GitHub

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Historial de procesos
- [ ] Descarga de CSV de resultados
- [ ] Plantilla Excel descargable
- [ ] Validación de formato antes de procesar
- [ ] Soporte para múltiples archivos
- [ ] Panel de administración

## 📄 Licencia

Este proyecto mantiene la misma licencia que el proyecto principal.
