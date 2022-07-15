## Mega AFIP botter

Basado en:

* https://stackoverflow.com/questions/64277178/how-to-open-the-new-tab-using-playwright-ex-click-the-button-to-open-the-new-s
* https://www.twilio.com/blog/automated-headless-browser-scripting-in-node-js-with-playwright
* https://www.browserstack.com/guide/playwright-tutorial
* https://www.scrapingbee.com/blog/playwright-web-scraping/
* https://playwright.dev/docs/selectors#best-practices
* https://playwright.dev/docs/selectors#quick-guide

###

Create .env file with following information
```
USER_CUIL='00000000000'
USER_PASS='XXXXXXXXX'
USER_NAME='XXXXXXXXXXXXXX'
USER_MONTO='14000'
```

Opcioonal:
```
N_PUNTO_VENTA='1`
```

Replace information with own data


## Generar Factura

```
npm run generar
```

## Consultar facturacion del mes

```
npm run consultar
```