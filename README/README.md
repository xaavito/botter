## Mega AFIP botter

```
.-. .-')                .-') _    .-') _    .-') _     ('-.     ('-.     ('-.     ('-.  _  .-')  _  .-')  _  .-')   
\  ( OO )              (  OO) )  (  OO) )  (  OO) )  _(  OO)  _(  OO)  _(  OO)  _(  OO)( \( -O )( \( -O )( \( -O )  
 ;-----.\  .-'),-----. /     '._ /     '._ /     '._(,------.(,------.(,------.(,------.,------. ,------. ,------.  
 | .-.  | ( OO'  .-.  '|'--...__)|'--...__)|'--...__)|  .---' |  .---' |  .---' |  .---'|   /`. '|   /`. '|   /`. ' 
 | '-' /_)/   |  | |  |'--.  .--''--.  .--''--.  .--'|  |     |  |     |  |     |  |    |  /  | ||  /  | ||  /  | | 
 | .-. `. \_) |  |\|  |   |  |      |  |      |  |  (|  '--. (|  '--. (|  '--. (|  '--. |  |_.' ||  |_.' ||  |_.' | 
 | |  \  |  \ |  | |  |   |  |      |  |      |  |   |  .--'  |  .--'  |  .--'  |  .--' |  .  '.'|  .  '.'|  .  '.' 
 | '--'  /   `'  '-'  '   |  |      |  |      |  |   |  `---. |  `---. |  `---. |  `---.|  |\  \ |  |\  \ |  |\  \  
 `------'      `-----'    `--'      `--'      `--'   `------' `------' `------' `------'`--' '--'`--' '--'`--' '--' 
```

## Descripción

**Botter** es un bot de automatización para la generación y gestión de facturas electrónicas en el sistema de AFIP (Administración Federal de Ingresos Públicos de Argentina). Utiliza Playwright para automatizar el navegador y realizar todas las operaciones necesarias en el portal de AFIP de forma programática.

## Características Principales

### 🚀 Generación de Facturas
- **Facturas Aleatorias**: Genera facturas con montos y conceptos aleatorios dentro de parámetros configurables
- **Facturas Nominadas**: Genera facturas a nombre de clientes específicos con CUIT
- **Facturas de Exportación**: Soporte para facturas de exportación
- **Generación Masiva**: Posibilidad de generar múltiples facturas en una sola ejecución

### 📊 Consultas y Reportes
- **Facturación Mensual**: Visualiza el total facturado en el mes actual
- **Facturación Anual**: Consulta el total facturado en los últimos 12 meses
- **Facturación Año Anterior**: Consulta el total del año calendario anterior
- **Descarga desde AFIP**: Descarga y guarda todas las facturas emitidas directamente desde el portal de AFIP

### 💾 Gestión de Datos
- **Almacenamiento Local**: Guarda todas las facturas generadas en archivos CSV
- **Gestión de Clientes**: Sistema de gestión de usuarios/clientes con CUIT para facturas nominadas
- **Histórico**: Mantiene registro completo de todas las operaciones realizadas

## Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Playwright**: Automatización de navegador
- **Inquirer**: Interfaz de línea de comandos interactiva
- **CSV Parser/Writer**: Manejo de archivos CSV para persistencia de datos
- **Chalk**: Formato y colores en la terminal
- **Figlet**: Arte ASCII para la presentación

## Basado en

- https://stackoverflow.com/questions/64277178/how-to-open-the-new-tab-using-playwright-ex-click-the-button-to-open-the-new-s
- https://www.twilio.com/blog/automated-headless-browser-scripting-in-node-js-with-playwright
- https://www.browserstack.com/guide/playwright-tutorial
- https://www.scrapingbee.com/blog/playwright-web-scraping/
- https://playwright.dev/docs/selectors#best-practices
- https://playwright.dev/docs/selectors#quick-guide
- https://www.digitalocean.com/community/tutorials/nodejs-interactive-command-line-prompts
- https://www.educative.io/answers/how-to-use-the-inquirer-node-package

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar las variables de entorno

## Configuración

Renombrar el archivo `.env.example` a `.env` y modificar la configuración con sus variables:

```env
USER_CUIL='00000000000'
USER_PASS='XXXXXXXXX'
# Es el valor que tiene AFIP para el cliente, en general es APELLIDO PRIMER_NOMBRE SEGUNDO_NOMBRE (todo en mayúsculas)
USER_NAME='XXXXXXXXXXXXXX'
# Todas las opciones una atras de otra, no meter /n o nada del estilo
# es el top de factura no nominada que permite la afip
TOPE_FACTURA='205000'
N_PUNTO_VENTA='1'
# Cuando se emiten facturas al azar se toman estos % y se los descuenta al valor TOPE_FACTURA
PORCENTAJES_FACTURACION=["10","15","5","20"]
# Todas las opciones una atras de otra, no meter /n o nada del estilo
DETALLES=["Actualización Servidor.","Actualización Cliente.","Arreglo pagina web.","Instalación paquetes","Instalación computadora nueva","Alta de cliente","Reparación base de datos","Backup base de datos","Proceso de backup automático","Servicio de Actualización de BD","Instalación de nueva terminal con cableado incluido"]
# Usar true si tenes chrome, sino lanza chromium
CHROME=false
```

Reemplazar información con la información propia.

### Descripción de Variables

- **USER_CUIL**: CUIL del usuario que generará las facturas
- **USER_PASS**: Contraseña de acceso a AFIP
- **USER_NAME**: Nombre completo como figura en AFIP (mayúsculas)
- **TOPE_FACTURA**: Monto máximo permitido para facturas no nominadas
- **N_PUNTO_VENTA**: Número de punto de venta a utilizar
- **PORCENTAJES_FACTURACION**: Porcentajes de descuento al tope para generar montos aleatorios
- **DETALLES**: Lista de descripciones posibles para las facturas
- **CHROME**: Si usar Chrome instalado (true) o Chromium (false)

## Uso

### Ejecutar el Bot

```bash
npm run botter
```

Esto abrirá un menú interactivo con las siguientes opciones:

### 1. Generar Factura Random
```bash
npm run botter
# Seleccionar: "Generar factura random"
```
Genera una factura con:
- Monto aleatorio calculado según `PORCENTAJES_FACTURACION` y `TOPE_FACTURA`
- Descripción aleatoria de la lista `DETALLES`
- Consumidor final (sin CUIT del receptor)

### 2. Generar Muchas Facturas
```bash
npm run botter
# Seleccionar: "Generar muchas"
```
Permite especificar la cantidad de facturas aleatorias a generar en una sola ejecución.

### 3. Generar Factura Nominada
```bash
npm run botter
# Seleccionar: "Generar Factura Nominada"
```
Genera una factura a nombre de un cliente específico:
1. Selecciona el cliente de la lista guardada
2. Ingresa el monto manualmente
3. Completa el CUIT y datos del receptor

### 4. Generar Factura de Exportación
```bash
npm run botter
# Seleccionar: "Generar Factura De Exportacion"
```
Genera una factura tipo exportación con el monto especificado.

### 5. Listar Facturas Realizadas
```bash
npm run botter
# Seleccionar: "listar facturas realizadas a la fecha"
```
Muestra las facturas guardadas localmente en el archivo CSV.

### 6. Ver Facturación Mensual
```bash
npm run botter
# Seleccionar: "Ver Facturacion Mensual"
```
Calcula y muestra el total facturado en el mes actual desde el CSV local.

### 7. Ver Facturación Anual
```bash
npm run botter
# Seleccionar: "Ver Facturacion Anual"
```
Calcula y muestra el total facturado en los últimos 365 días desde el CSV local.

### 8. Ver Facturación Año Anterior
```bash
npm run botter
# Seleccionar: "Ver Facturacion Anual Año anterior"
```
Calcula y muestra el total facturado en el año calendario anterior.

### 9. Descargar Facturación Anual de AFIP
```bash
npm run botter
# Seleccionar: "Descargar Facturacion Anual de AFIP"
```
Conecta al portal de AFIP y descarga todas las facturas emitidas del año actual, guardándolas en un CSV separado.

### 10. Insertar Usuario
```bash
npm run botter
# Seleccionar: "Insertar Usuario"
```
Agrega un nuevo cliente a la lista de usuarios para facturas nominadas:
- Nombre del usuario
- CUIT del usuario

## Estructura del Proyecto

```
botter/
├── pages/                      # Módulos de páginas de AFIP
│   ├── login.js               # Proceso de login
│   ├── generar_comprobantes.js # Navegación a generación
│   ├── cargar_concepto.js     # Carga del concepto de la factura
│   ├── cargar_iva_receptor.js # Carga de datos del receptor
│   ├── cargar_item_factura.js # Carga de items y montos
│   ├── confirmar.js           # Confirmación de factura
│   ├── confirmarDialogo.js    # Confirmación de diálogo modal
│   ├── imprimir_factura.js    # Impresión y descarga
│   ├── consultas.js           # Acceso a consultas
│   ├── buscar.js              # Búsqueda de facturas
│   ├── iterar_tabla.js        # Iteración y extracción de tablas
│   └── ...                    # Otros módulos de navegación
├── index.js                   # Punto de entrada con menú CLI
├── generar.js                 # Lógica principal de generación
├── listar.js                  # Cálculos de facturación local
├── listarOnline.js            # Descarga desde AFIP
├── helper.js                  # Funciones auxiliares
├── constants.js               # Constantes del proyecto
├── logger.js                  # Sistema de logging
├── .env                       # Variables de entorno (no incluido)
├── .env.example               # Ejemplo de configuración
└── package.json               # Dependencias del proyecto
```

### Módulos Principales

#### `index.js`
Punto de entrada de la aplicación. Proporciona:
- Menú interactivo con Inquirer
- Orquestación de todas las funcionalidades
- Manejo de respuestas y feedback al usuario

#### `generar.js`
Función principal de generación de facturas:
- Inicia navegador con Playwright
- Ejecuta flujo completo de generación
- Coordina todos los steps de las páginas
- Guarda resultados en CSV

#### `listar.js`
Sistema de consultas sobre facturas locales:
- Lee archivo CSV de facturas
- Calcula totales por períodos
- Filtra por rangos de fechas

#### `listarOnline.js`
Descarga de facturas desde AFIP:
- Automatiza navegación en portal de AFIP
- Extrae datos de tablas
- Guarda en CSV separado

#### `helper.js`
Funciones auxiliares:
- Formateo de fechas
- Generación de valores aleatorios
- Escritura/lectura de CSV
- Gestión de archivos de usuarios

### Módulos de Páginas (`pages/`)

Cada archivo representa un step en el flujo de AFIP:

- **Autenticación**: `login.js`, `ver_todos.js`
- **Navegación**: `comprobantes_en_linea.js`, `mi_pagina.js`, `menu_principal.js`
- **Generación**: `generar_comprobantes.js`, `seleccionar_pto_vta.js`, `continuar.js`
- **Carga de Datos**: `cargar_concepto.js`, `cargar_iva_receptor.js`, `cargar_item_factura.js`
- **Confirmación**: `confirmar.js`, `confirmarDialogo.js`
- **Finalización**: `imprimir_factura.js`
- **Consultas**: `consultas.js`, `buscar.js`, `iterar_tabla.js`

## Archivos Generados

### CSV de Facturas Locales
**Nombre**: `{USER_CUIL}.csv`

Contiene todas las facturas generadas localmente:
```csv
Fecha,Item,Monto
13/11/2025,Actualización Servidor.,195000
14/11/2025,Instalación paquetes,184500
```

### CSV de Facturación Anual AFIP
**Nombre**: `{USER_CUIL}-facturacionAnual.csv`

Contiene las facturas descargadas desde AFIP con todas las columnas de la tabla.

### Archivo de Usuarios
**Nombre**: `usuarios.txt`

Lista de clientes para facturas nominadas:
```
Usuario: EMPRESA S.A., CUIT: 30123456789
Usuario: CLIENTE DOS, CUIT: 20987654321
```

## Comandos de Desarrollo

### Chequeo de Formato
```bash
npm run format:check
```
Verifica que el código cumple con las reglas de formato de Prettier.

### Formateo Automático
```bash
npm run format:write
```
Aplica formato automático al código según configuración de Prettier.

### Chequeo de Linting
```bash
npm run lint:check
```
Verifica que el código cumple con las reglas de ESLint.

### Autofix de Linting
```bash
npm run lint:fix
```
Corrige automáticamente problemas de linting cuando es posible.

## Flujo de Generación de Facturas

1. **Login**: Autenticación en AFIP con CUIL y contraseña
2. **Navegación**: Acceso a "Comprobantes en línea"
3. **Inicio**: Click en "Generar Comprobantes"
4. **Punto de Venta**: Selección del punto de venta configurado
5. **Continuar**: Avance al formulario de carga
6. **Concepto**: Selección del tipo de concepto facturado
7. **Receptor**: Carga de datos del receptor (Consumidor Final o datos de cliente)
8. **Items**: Carga de descripción y monto de la factura
9. **Confirmación**: Validación de datos ingresados
10. **Diálogo**: Confirmación final en modal
11. **Impresión**: Generación del comprobante
12. **Guardado**: Almacenamiento en CSV local

## Consideraciones de Seguridad

⚠️ **IMPORTANTE**:
- Nunca commitear el archivo `.env` con credenciales reales
- El archivo `.env` está en `.gitignore` por defecto
- Las contraseñas se manejan como variables de entorno
- Ejecutar en entorno seguro y de confianza

## Requisitos del Sistema

- Node.js >= 14.x
- Sistema operativo: Linux, macOS o Windows
- Navegador: Chrome o Chromium (se instala automáticamente con Playwright)
- Conexión a Internet para acceder a AFIP

## Limitaciones Conocidas

- Requiere credenciales válidas de AFIP
- Depende de la estructura del sitio web de AFIP (puede cambiar)
- El tope de facturación debe coincidir con la habilitación de AFIP
- La ejecución no es instantánea (automatización de navegador)

## Solución de Problemas

### Error de Autenticación
- Verificar `USER_CUIL` y `USER_PASS` en `.env`
- Confirmar que las credenciales son correctas en el sitio de AFIP

### Timeout en Navegación
- Aumentar el valor de `TIMEOUT` en `constants.js`
- Verificar conexión a Internet
- Revisar si AFIP está disponible

### Errores de Selectores
- AFIP puede haber cambiado su interfaz
- Revisar los módulos en `pages/` y actualizar selectores si es necesario

### Facturas No Se Guardan
- Verificar permisos de escritura en el directorio
- Confirmar que `USER_CUIL` está configurado correctamente

## Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork del repositorio
2. Crear una rama para tu feature
3. Commit de cambios
4. Push a la rama
5. Crear Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia que especifiques.

## Descargo de Responsabilidad

Este bot es una herramienta de automatización para uso personal. El usuario es responsable de:
- Cumplir con todas las regulaciones de AFIP
- Usar sus propias credenciales
- Verificar la exactitud de las facturas generadas
- Mantener la seguridad de sus credenciales

El uso de este software es bajo tu propio riesgo.

## Soporte

Para reportar bugs o solicitar features, por favor abrir un issue en el repositorio.
