# 🚀 Deployment - Facturador AFIP Web

## Guía Rápida de Deployment en la Nube (5 minutos)

### 🎯 Objetivo
Poner el facturador en línea para que cualquier persona pueda usarlo con solo una URL, sin instalar nada.

---

## ☁️ Opción 1: Railway (Recomendado - MÁS FÁCIL)

### Ventajas
- ✅ **Gratis** (500 horas/mes gratuitas)
- ✅ **Muy fácil** de configurar
- ✅ **Deploy automático** desde GitHub
- ✅ **URL personalizable**
- ✅ **SSL gratis** (HTTPS)

### Pasos

#### 1. Preparar el Código
```bash
# Asegúrate que .gitignore esté configurado (ya está listo)
git add .
git commit -m "Add web interface for AFIP invoicing"
git push origin main
```

#### 2. Ir a Railway
1. Ve a https://railway.app
2. Crea una cuenta con GitHub (gratis)
3. Click en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Elige el repositorio **botter**

#### 3. Configurar Variables de Entorno
En Railway, ve a la pestaña **"Variables"** y agrega:

```env
USER_CUIL=20123456789
USER_PASS=TuContraseñaAFIP
USER_NAME=TU NOMBRE COMPLETO
TOPE_FACTURA=205000
N_PUNTO_VENTA=1
PORCENTAJES_FACTURACION=["10","15","5","20"]
DETALLES=["Actualización Servidor.","Consultoría IT.","Desarrollo web."]
CHROME=false
PORT=3000
NODE_ENV=production
```

**⚠️ IMPORTANTE:** Reemplaza los valores con tus credenciales reales.

#### 4. Deploy
1. Railway detecta automáticamente que es Node.js
2. Build command: `npm install` (automático)
3. Start command: `npm start` (ya configurado en package.json)
4. Click en **"Deploy"**

#### 5. Obtener la URL
1. Espera 2-3 minutos mientras despliega
2. Ve a la pestaña **"Settings"**
3. En **"Domains"**, click en **"Generate Domain"**
4. Obtendrás una URL como: `https://botter-production-xxxx.up.railway.app`

#### 6. ¡Listo!
Comparte la URL con quien necesite usarla. Solo necesitan:
- Abrir la URL en el navegador
- Subir su Excel
- Procesar facturas

---

## ☁️ Opción 2: Render

### Ventajas
- ✅ **Gratis** (plan básico)
- ✅ **Fácil** de usar
- ✅ **SSL automático**
- ⚠️ Puede dormir después de 15 min sin uso (tarda ~30seg en despertar)

### Pasos

#### 1. Preparar el Código
```bash
git add .
git commit -m "Add web interface"
git push origin main
```

#### 2. Ir a Render
1. Ve a https://render.com
2. Crea una cuenta con GitHub
3. Click en **"New +"** → **"Web Service"**
4. Conecta tu repositorio GitHub
5. Selecciona el repo **botter**

#### 3. Configuración
- **Name:** botter-afip
- **Environment:** Node
- **Branch:** main
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

#### 4. Variables de Entorno
Click en **"Advanced"** → **"Add Environment Variable"**

Agrega cada una:
```
USER_CUIL=20123456789
USER_PASS=TuContraseña
USER_NAME=TU NOMBRE AFIP
TOPE_FACTURA=205000
N_PUNTO_VENTA=1
PORCENTAJES_FACTURACION=["10","15","5","20"]
DETALLES=["Servicios IT.","Consultoría."]
CHROME=false
PORT=3000
```

#### 5. Deploy
1. Click en **"Create Web Service"**
2. Espera 3-5 minutos
3. Te dará una URL como: `https://botter-afip.onrender.com`

---

## ☁️ Opción 3: Heroku (Alternativa)

### Nota
Heroku ya no tiene plan gratuito, pero si ya tienes cuenta:

#### 1. Instalar Heroku CLI
```bash
# Mac
brew install heroku/brew/heroku

# Windows
# Descargar desde: https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Login y Crear App
```bash
heroku login
heroku create botter-afip
```

#### 3. Configurar Variables
```bash
heroku config:set USER_CUIL=20123456789
heroku config:set USER_PASS=TuContraseña
heroku config:set USER_NAME="TU NOMBRE"
heroku config:set TOPE_FACTURA=205000
heroku config:set N_PUNTO_VENTA=1
heroku config:set CHROME=false
heroku config:set PORT=3000
heroku config:set 'PORCENTAJES_FACTURACION=["10","15","5","20"]'
heroku config:set 'DETALLES=["Servicios IT.","Consultoría."]'
```

#### 4. Deploy
```bash
git push heroku main
```

#### 5. Abrir
```bash
heroku open
```

---

## 🔒 Consideraciones de Seguridad

### ⚠️ IMPORTANTE - LEE ESTO

1. **Variables de Entorno**
   - ✅ Usa siempre variables de entorno en producción
   - ❌ NUNCA hagas commit del archivo `.env`
   - ✅ El `.gitignore` ya está configurado para evitarlo

2. **Credenciales**
   - Las credenciales de AFIP quedan en el servidor
   - Solo tú tienes acceso a las variables de entorno
   - Los archivos Excel se borran después de procesarse

3. **Acceso Público**
   - Cualquiera con la URL puede usar el facturador
   - **Recomendación:** Comparte la URL solo con personas de confianza
   - **Mejora futura:** Agregar autenticación

4. **Límites**
   - Railway: 500 horas/mes gratis
   - Render: Duerme después de 15 min inactivo (plan free)
   - Ambos tienen límites de CPU/RAM

---

## 🧪 Verificar que Funciona

### Después del Deploy

1. **Abre la URL** que te dio Railway/Render
2. **Verifica** que la página cargue correctamente
3. **Prepara un Excel de prueba** con 1-2 filas
4. **Sube el archivo** y verifica que procese

### Logs en Vivo

#### Railway
1. Ve a tu proyecto
2. Click en la pestaña **"Deployments"**
3. Click en el deployment activo
4. Verás los logs en tiempo real

#### Render
1. Ve a tu Web Service
2. Click en **"Logs"**
3. Verás la salida del servidor

---

## 🛠️ Troubleshooting

### Error: "Application Error" o 503

**Causa:** El servidor no pudo iniciar

**Solución:**
1. Verifica los logs
2. Asegúrate que todas las variables de entorno estén configuradas
3. Verifica que `npm start` funcione localmente

### El sitio carga pero no procesa facturas

**Causa:** Credenciales de AFIP incorrectas

**Solución:**
1. Verifica `USER_CUIL` y `USER_PASS` en las variables de entorno
2. Prueba las credenciales en el sitio de AFIP manualmente

### Timeout durante el procesamiento

**Causa:** Los planes gratuitos tienen límites de tiempo

**Solución:**
1. Railway: Límite de 100 facturas por ejecución
2. Render: Puede necesitar upgrade para procesos largos
3. Divide tu Excel en lotes más pequeños

### "Port already in use"

**Causa:** Variable PORT incorrecta

**Solución:**
```bash
# En Railway/Render, asegúrate:
PORT=3000
```

---

## 📊 Monitoring

### Railway

Dashboard automático con:
- CPU usage
- Memory usage
- Request count
- Deploy history

### Render

Dashboard con:
- Status del servicio
- Métricas de rendimiento
- Logs en tiempo real

---

## 💰 Costos

### Railway
- **Free tier:** 500 horas/mes
- **Pro:** $5/mes (ilimitado)
- Ideal para: Uso ocasional

### Render
- **Free tier:** Gratis (con limitaciones)
- **Starter:** $7/mes
- Ideal para: POC y demos

### Heroku
- **Free tier:** Ya no disponible
- **Hobby:** $7/mes
- Ideal para: Apps en producción

---

## 🚀 Actualizar el Deploy

Cuando hagas cambios al código:

```bash
# 1. Commit los cambios
git add .
git commit -m "Descripción del cambio"

# 2. Push a GitHub
git push origin main

# 3. Railway/Render redeploy automáticamente
# No necesitas hacer nada más!
```

---

## 🎯 Próximos Pasos Recomendados

1. **Agregar autenticación básica**
   - Proteger con usuario/contraseña
   - Evitar acceso no autorizado

2. **Rate limiting**
   - Limitar requests por IP
   - Prevenir abuso

3. **Backup de resultados**
   - Guardar CSVs en cloud storage
   - S3, Google Cloud Storage, etc.

4. **Notificaciones**
   - Email al terminar procesamiento
   - Telegram/WhatsApp notifications

5. **Multi-usuario**
   - Cada usuario sus credenciales
   - Base de datos para gestión

---

## 📞 Soporte

Si tienes problemas con el deployment:

1. Revisa los logs del servicio
2. Verifica las variables de entorno
3. Prueba localmente primero (`npm start`)
4. Consulta la documentación oficial:
   - Railway: https://docs.railway.app
   - Render: https://render.com/docs

---

## ✅ Checklist de Deployment

Antes de compartir la URL con usuarios:

- [ ] Deploy exitoso (status: Running)
- [ ] Variables de entorno configuradas
- [ ] Página carga correctamente
- [ ] Probado con Excel de prueba
- [ ] Facturas se generan correctamente
- [ ] SSL/HTTPS funcionando
- [ ] Logs sin errores críticos

**¡Una vez completado, comparte la URL y disfruta! 🎉**
