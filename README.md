## Mega AFIP botter

Basado en:

- https://stackoverflow.com/questions/64277178/how-to-open-the-new-tab-using-playwright-ex-click-the-button-to-open-the-new-s
- https://www.twilio.com/blog/automated-headless-browser-scripting-in-node-js-with-playwright
- https://www.browserstack.com/guide/playwright-tutorial
- https://www.scrapingbee.com/blog/playwright-web-scraping/
- https://playwright.dev/docs/selectors#best-practices
- https://playwright.dev/docs/selectors#quick-guide

###

# Setup
Renombrar el archivo `.env.example` y modificar la configuracion con sus variables:

```
USER_CUIL='00000000000'
USER_PASS='XXXXXXXXX'
USER_NAME='XXXXXXXXXXXXXX'
# Todas las opciones una atras de otra, no meter /n o nada del estilo
USER_MONTO=["18000", "19000", "15000"]
# Todas las opciones una atras de otra, no meter /n o nada del estilo
DETALLES=["Actualización Servidor.","Actualización Cliente.","Arreglo pagina web.","Instalación paquetes","Instalación computadora nueva","Alta de cliente","Reparación base de datos","Backup base de datos","Proceso de backup automático","Servicio de Actualización de BD","Instalación de nueva terminal con cableado incluido"]
```

Opcional:

```
N_PUNTO_VENTA='1'
```

Reemplazar informacion con la informacion propia.


# Comandos disponibles:


## Generar Factura

Las facturas se generarán con una descripcion del servicio facturado random obtenido de `detalles.json`

```
npm run generar
```

## Consultar facturación del mes

```
npm run consultar
```

## Generar 1 o más facturas

Para este comando se requiere una configuration adicional donde especificamos que facturas se van a generar:

1. Crear en la carpeta `Multigenerador` un archivo `facturas.json` con el siguiente formato:
```
[
  {
    "concepto": "2",
    "descripcion": "Canje en instagram",
    "monto": "10000"
  },
  {
    "concepto": "2",
    "descripcion": "Onlyfans de pies",
    "monto": "20000"
  }
  ...
]
```
Cada una de las entradas, es una factura que vamos a generar.

2. ejecutar:
```
npm run multi-generar
```

# Desarrollo

## Chequeo de formato

```
npm run format:check
```

## Formateo

```
npm run format:write
```

## Chequeo eslint

```
npm run lint:check
```

## Autofix eslint

```
npm run lint:fix
```
