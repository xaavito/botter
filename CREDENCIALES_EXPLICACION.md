# 🔐 Explicación de Credenciales

## Hay DOS sistemas de autenticación diferentes:

---

## 1️⃣ Credenciales de AFIP (para generar facturas)

Estas son **tus credenciales del sitio de AFIP**:

```env
USER_CUIL=20123456789          # Tu CUIT/CUIL de AFIP
USER_PASS=MiClaveAFIP123       # Tu contraseña de AFIP
USER_NAME=GONZALEZ JAVIER      # Tu nombre como figura en AFIP
```

**¿Para qué?**
- El bot las usa para **hacer login en AFIP**
- Son las mismas que usas cuando entras a https://auth.afip.gob.ar

**⚠️ IMPORTANTE:**
- Estas credenciales **NUNCA** se le piden al usuario de la web
- Quedan guardadas en el servidor (archivo `.env` o variables de entorno)
- El bot las usa automáticamente en segundo plano

---

## 2️⃣ Credenciales de la Interfaz Web (login de tu aplicación)

Estas las defines **TÚ** para proteger tu aplicación web:

```env
AUTH_USERNAME=admin                    # Usuario para entrar a TU web
AUTH_PASSWORD=MiPasswordSeguro123      # Contraseña para entrar a TU web
SESSION_SECRET=abc123xyz789secret      # Secret para encriptar sesiones
```

**¿Para qué?**
- El usuario que va a usar tu web debe hacer login con estas
- Proteges tu aplicación de accesos no autorizados
- **TÚ eliges** el usuario y contraseña

**Ejemplo de uso:**
1. Usuario abre: `http://localhost:3000` o `https://tu-app.railway.app`
2. Ve la pantalla de login 🔐
3. Ingresa:
   - **Usuario:** `admin` (lo que pusiste en AUTH_USERNAME)
   - **Contraseña:** `MiPasswordSeguro123` (lo que pusiste en AUTH_PASSWORD)
4. Accede a la interfaz para subir Excel
5. El sistema usa automáticamente las credenciales de AFIP en segundo plano

---

## 🔑 SESSION_SECRET - ¿Qué es?

El `SESSION_SECRET` es una **clave secreta** que se usa para:

- **Encriptar las sesiones** de los usuarios
- Evitar que alguien pueda "hackear" las sesiones
- Firmar las cookies de sesión

**¿Qué poner?**
- Una cadena **aleatoria** y **larga**
- Mínimo 32 caracteres
- Mezcla de letras, números y símbolos

**Ejemplos de buenos secrets:**
```env
SESSION_SECRET=kJ8mN2pQ5rT9wX3zA6bC1dE4fH7gI0jK
SESSION_SECRET=my-super-secret-key-2024-afip-facturador-xyz123
SESSION_SECRET=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

**Genera uno fácil:**
```bash
# En tu terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📋 Ejemplo Completo de .env

```env
# ==========================================
# CREDENCIALES DE AFIP (para el bot)
# ==========================================
USER_CUIL=20123456789
USER_PASS=MiClaveDeAFIP2024
USER_NAME=GONZALEZ JAVIER MARTIN

# ==========================================
# CREDENCIALES DE LA WEB (login de tu app)
# ==========================================
# IMPORTANTE: Cambia estos valores!
AUTH_USERNAME=admin
AUTH_PASSWORD=PasswordSuperSeguro123!
SESSION_SECRET=kJ8mN2pQ5rT9wX3zA6bC1dE4fH7gI0jK

# ==========================================
# CONFIGURACIÓN DE FACTURACIÓN
# ==========================================
TOPE_FACTURA=205000
N_PUNTO_VENTA=1
CHROME=false
```

---

## 🎯 Flujo Visual Completo

```
Usuario Final
    │
    ├─> Abre http://localhost:3000
    │
    ├─> Ve pantalla de LOGIN 🔐
    │
    ├─> Ingresa:
    │   ├─ Usuario: admin          ← AUTH_USERNAME
    │   └─ Password: PassSeguro    ← AUTH_PASSWORD
    │
    ├─> Accede a la interfaz web ✅
    │
    ├─> Sube archivo Excel
    │
    ├─> Click en "Procesar"
    │
    └─> En segundo plano:
        │
        ├─> Bot hace login en AFIP
        │   ├─ CUIL: USER_CUIL      ← De .env
        │   └─ Pass: USER_PASS      ← De .env
        │
        ├─> Genera facturas
        │
        └─> Usuario descarga ZIP con PDFs
```

---

## ⚠️ Seguridad - IMPORTANTE

### ✅ Hacer:
1. **Cambiar** `AUTH_PASSWORD` por una contraseña fuerte
2. **Cambiar** `SESSION_SECRET` por uno aleatorio largo
3. **NO compartir** las credenciales de AFIP
4. **NO hacer commit** del archivo `.env`

### ❌ NO Hacer:
1. NO uses `admin`/`admin` en producción
2. NO uses passwords simples como `123456`
3. NO compartas el archivo `.env` con nadie
4. NO hagas commit del `.env` a GitHub

---

## 🔄 Cambiar Credenciales Web

Si quieres cambiar el usuario/password de la web:

1. Edita tu `.env`:
```env
AUTH_USERNAME=miusuario
AUTH_PASSWORD=NuevaPassword2024!
```

2. Reinicia el servidor:
```bash
npm start
```

3. Ahora el login es:
   - Usuario: `miusuario`
   - Password: `NuevaPassword2024!`

---

## 🌐 Para Múltiples Usuarios

Si quieres que **varias personas** usen tu web, hay dos opciones:

### Opción 1: Compartir las mismas credenciales
- Todos usan el mismo `AUTH_USERNAME` y `AUTH_PASSWORD`
- Más simple pero menos seguro

### Opción 2: Sistema de usuarios múltiples
- Requiere una base de datos
- Cada persona tiene su usuario/contraseña
- Más complejo pero más seguro
- (No implementado actualmente)

---

## 💡 Preguntas Frecuentes

### ¿Puedo usar mi email como usuario?
Sí:
```env
AUTH_USERNAME=javier@miempresa.com
AUTH_PASSWORD=MiPassword123
```

### ¿Qué pasa si olvido la contraseña web?
Simplemente cambia `AUTH_PASSWORD` en el `.env` y reinicia.

### ¿Las credenciales de AFIP están seguras?
Sí, están:
- En el servidor (no se envían al navegador)
- En el archivo `.env` (no se sube a GitHub)
- Encriptadas en memoria durante el proceso

### ¿Necesito crear usuarios en algún lado?
No, solo defines `AUTH_USERNAME` y `AUTH_PASSWORD` en `.env`.

---

## ✅ Checklist de Seguridad

Antes de desplegar:

- [ ] Cambié AUTH_PASSWORD por una contraseña fuerte
- [ ] Generé un SESSION_SECRET aleatorio y largo
- [ ] Verifiqué que .env esté en .gitignore
- [ ] No compartí las credenciales de AFIP
- [ ] Probé el login con las nuevas credenciales
- [ ] Documenté las credenciales en un lugar seguro

**¡Listo! Tu sistema está protegido con dos capas de seguridad.** 🔒
