# 🍓 Deployment en Raspberry Pi + Cloudflare Tunnel

## Guía Completa para Argentina

Esta guía te muestra cómo correr el facturador en tu Raspberry Pi (en Argentina) y publicarlo de forma segura con Cloudflare Tunnel, sin necesidad de abrir puertos en tu router.

---

## 📋 Requisitos

### Hardware
- **Raspberry Pi 3/4/5** (recomendado 4 o 5 con al menos 2GB RAM)
- Tarjeta microSD (16GB mínimo, 32GB recomendado)
- Conexión a Internet estable

### Software
- Raspberry Pi OS (64-bit recomendado)
- Docker y Docker Compose
- Cuenta de Cloudflare (gratis)

---

## 🚀 Paso 1: Preparar la Raspberry Pi

### 1.1 Actualizar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Instalar Docker

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER

# Aplicar cambios (o reiniciar)
newgrp docker

# Verificar instalación
docker --version
```

### 1.3 Instalar Docker Compose

```bash
# Para Raspberry Pi 4/5 (ARM64)
sudo apt install -y docker-compose

# O instalar la última versión:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker-compose --version
```

---

## 📁 Paso 2: Clonar y Configurar el Proyecto

### 2.1 Clonar el Repositorio

```bash
cd ~
git clone https://github.com/tu-usuario/botter.git
cd botter
```

### 2.2 Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar con tus credenciales
nano .env
```

**Configura al menos estas variables:**

```env
# AFIP
USER_CUIL=20123456789
USER_PASS=TuPasswordAFIP
USER_NAME=TU NOMBRE COMPLETO

# Autenticación Web (CAMBIAR ESTOS!)
AUTH_USERNAME=admin
AUTH_PASSWORD=password-super-seguro-123
SESSION_SECRET=abc123xyz789-cambiar-este-secret

# Servidor
PORT=3000
NODE_ENV=production
CHROME=false
```

**Guardar:** `Ctrl+O`, Enter, `Ctrl+X`

---

## 🐳 Paso 3: Construir y Correr con Docker

### 3.1 Construir la Imagen

```bash
# Esto puede tardar 10-15 minutos en una Raspberry Pi
docker-compose build
```

### 3.2 Iniciar el Contenedor

```bash
docker-compose up -d
```

### 3.3 Verificar que Está Corriendo

```bash
# Ver logs
docker-compose logs -f

# Verificar estado
docker ps

# Deberías ver algo como:
# CONTAINER ID   IMAGE         STATUS          PORTS
# abc123...      botter-afip   Up 2 minutes    0.0.0.0:3000->3000/tcp
```

### 3.4 Probar Localmente

Desde tu computadora en la misma red:

```
http://IP_DE_TU_RASPBERRY:3000
```

Ejemplo: `http://192.168.1.100:3000`

Si funciona, ¡perfecto! Ahora vamos a publicarlo con Cloudflare.

---

## ☁️ Paso 4: Configurar Cloudflare Tunnel

### ¿Por qué Cloudflare Tunnel?

- ✅ **No necesitas abrir puertos** en tu router
- ✅ **SSL/HTTPS gratis** automático
- ✅ **IP pública no necesaria**
- ✅ **DDoS protection** incluida
- ✅ **Funciona detrás de NAT** (perfecto para Argentina)

### 4.1 Crear Cuenta en Cloudflare

1. Ve a https://cloudflare.com
2. Crea una cuenta gratuita
3. Agrega un dominio (o usa un subdominio de Cloudflare)

**Si NO tienes dominio:**
- Cloudflare te da un subdominio gratis como: `tu-app.trycloudflare.com`

### 4.2 Instalar Cloudflared en Raspberry Pi

```bash
# Para Raspberry Pi (ARM)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Verificar
cloudflared --version
```

### 4.3 Autenticar Cloudflared

```bash
cloudflared tunnel login
```

Esto abrirá un navegador (o te dará una URL). Selecciona tu dominio o crea uno.

### 4.4 Crear el Tunnel

```bash
# Crear tunnel
cloudflared tunnel create facturador-afip

# Esto creará un archivo de credenciales en:
# ~/.cloudflared/[TUNNEL-ID].json

# Guardar el TUNNEL-ID que aparece
```

### 4.5 Configurar el Tunnel

```bash
# Crear archivo de configuración
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

**Contenido del archivo:**

```yaml
tunnel: TU-TUNNEL-ID-AQUI
credentials-file: /home/pi/.cloudflared/TU-TUNNEL-ID-AQUI.json

ingress:
  - hostname: facturador.tudominio.com
    service: http://localhost:3000
  - service: http_status:404
```

**Reemplaza:**
- `TU-TUNNEL-ID-AQUI` con tu tunnel ID
- `facturador.tudominio.com` con tu dominio/subdominio

**Si NO tienes dominio propio:**

```yaml
tunnel: TU-TUNNEL-ID-AQUI
credentials-file: /home/pi/.cloudflared/TU-TUNNEL-ID-AQUI.json

ingress:
  - service: http://localhost:3000
```

**Guardar:** `Ctrl+O`, Enter, `Ctrl+X`

### 4.6 Crear Registro DNS (solo si tienes dominio)

```bash
cloudflared tunnel route dns facturador-afip facturador.tudominio.com
```

Esto crea automáticamente el registro CNAME en Cloudflare.

### 4.7 Correr el Tunnel

```bash
# Modo prueba (para verificar que funciona)
cloudflared tunnel run facturador-afip
```

Si ves `Connection established`, ¡funciona! 

Prueba abrir: `https://facturador.tudominio.com`

### 4.8 Correr Tunnel como Servicio (Automático)

Para que se inicie automáticamente al encender la Raspberry Pi:

```bash
# Instalar como servicio
sudo cloudflared service install

# Iniciar servicio
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Ver estado
sudo systemctl status cloudflared
```

---

## 🔒 Paso 5: Seguridad Adicional (Opcional pero Recomendado)

### 5.1 Configurar Firewall en Cloudflare

En el dashboard de Cloudflare:

1. Ve a **Security** → **WAF**
2. Crea reglas para:
   - Bloquear países específicos (si solo usas en Argentina)
   - Rate limiting (limitar requests por IP)
   - Bloquear IPs sospechosas

### 5.2 Habilitar Cloudflare Access (Autenticación Extra)

Para agregar una capa extra de seguridad antes del login:

1. En Cloudflare: **Zero Trust** → **Access**
2. Crea una aplicación para tu dominio
3. Configura políticas de acceso (por email, por IP, etc.)

Esto es adicional a la autenticación que ya tiene la app.

---

## 🔧 Comandos Útiles de Mantenimiento

### Docker

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicio
docker-compose restart

# Detener servicio
docker-compose down

# Actualizar después de cambios en el código
git pull
docker-compose down
docker-compose build
docker-compose up -d

# Limpiar espacio (cuidado: borra imágenes no usadas)
docker system prune -a
```

### Cloudflare Tunnel

```bash
# Ver túneles activos
cloudflared tunnel list

# Ver estado del servicio
sudo systemctl status cloudflared

# Reiniciar tunnel
sudo systemctl restart cloudflared

# Ver logs del tunnel
sudo journalctl -u cloudflared -f
```

### Sistema

```bash
# Ver uso de recursos
htop

# Ver espacio en disco
df -h

# Ver temperatura de la Raspberry Pi
vcgencmd measure_temp

# Reiniciar Raspberry Pi
sudo reboot
```

---

## 📊 Monitoreo y Logs

### Ver Logs de la Aplicación

```bash
# Logs en tiempo real
docker-compose logs -f facturador-afip

# Últimas 100 líneas
docker-compose logs --tail=100 facturador-afip
```

### Configurar Alertas (Opcional)

Usa herramientas como:
- **Uptime Robot** (gratis) - monitorea si el sitio está up
- **Healthchecks.io** - envía pings periódicos
- **Telegram Bot** - notificaciones push

---

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs de error
docker-compose logs facturador-afip

# Verificar permisos
ls -la data/
sudo chown -R 1001:1001 data/ invoices/
```

### El tunnel no conecta

```bash
# Verificar configuración
cat ~/.cloudflared/config.yml

# Probar tunnel manualmente
cloudflared tunnel run facturador-afip

# Verificar logs
sudo journalctl -u cloudflared -n 50
```

### La Raspberry Pi está lenta

```bash
# Ver uso de CPU/RAM
htop

# Limitar recursos en docker-compose.yml
# Editar la sección deploy > resources
nano docker-compose.yml
```

### No puedo acceder desde afuera

1. Verifica que el tunnel esté corriendo:
   ```bash
   sudo systemctl status cloudflared
   ```

2. Verifica la configuración DNS en Cloudflare

3. Prueba con `curl`:
   ```bash
   curl https://facturador.tudominio.com
   ```

### Error de memoria en Raspberry Pi 3

Si tienes solo 1GB RAM, reduce los límites en `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      memory: 1G
    reservations:
      memory: 256M
```

---

## 📱 Acceso desde Cualquier Lado

Una vez configurado:

1. **Desde tu casa:** `https://facturador.tudominio.com`
2. **Desde el celular:** `https://facturador.tudominio.com`
3. **Desde la oficina:** `https://facturador.tudominio.com`
4. **Desde cualquier lugar:** `https://facturador.tudominio.com`

Todo pasa por Cloudflare → Tunnel → Tu Raspberry Pi en Argentina

---

## 🎯 Checklist Final

Antes de compartir con usuarios:

- [ ] Docker corriendo correctamente
- [ ] Variables de entorno configuradas
- [ ] Autenticación funcionando
- [ ] Cloudflare Tunnel activo
- [ ] DNS configurado (si aplica)
- [ ] Probado desde afuera de tu red
- [ ] Contraseña fuerte configurada
- [ ] Logs funcionando
- [ ] Backup de datos configurado

---

## 💰 Costos

- **Raspberry Pi:** Compra única (~$50-100 USD)
- **Electricidad:** ~$2-5 USD/mes (en Argentina)
- **Internet:** Ya lo tienes
- **Cloudflare Tunnel:** **GRATIS**
- **Dominio (opcional):** ~$10-15 USD/año

**Total mensual: ~$2-5 USD** ⚡

Vs Railway/Render: ~$7-20 USD/mes después del tier gratuito

---

## 📚 Recursos Adicionales

- **Cloudflare Tunnel Docs:** https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- **Docker en Raspberry Pi:** https://docs.docker.com/engine/install/debian/
- **Raspberry Pi Docs:** https://www.raspberrypi.com/documentation/

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs de Docker y Cloudflared
2. Verifica que todos los servicios estén corriendo
3. Prueba localmente primero (sin Cloudflare)
4. Abre un issue en GitHub

¡Disfruta tu facturador corriendo en Argentina 🇦🇷 accesible desde todo el mundo! 🌍
