const playwright = require('playwright')
const {
  dateFormatted,
  saveToCSV,
} = require('./helper.js')

const { login } = require('./pages/login.js')
const { verTodos } = require('./pages/ver_todos.js')
const { comprobantesEnLinea } = require('./pages/comprobantes_en_linea.js')
const { miPagina } = require('./pages/mi_pagina.js')
const { generarComprobantes } = require('./pages/generar_comprobantes.js')
const { seleccionarPuntoVenta } = require('./pages/seleccionar_pto_vta.js')

const { continuar } = require('./pages/continuar.js')
const { cargarConcepto } = require('./pages/cargar_concepto.js')
const { cargarIVAReceptor } = require('./pages/cargar_iva_receptor.js')
const { cargarItemFactura } = require('./pages/cargar_item_factura.js')
const { confirmar } = require('./pages/confirmar.js')
const { imprimirFactura } = require('./pages/imprimir_factura.js')

async function generar() {
  let detalle
  let valor

  // disable headless to see the browser's action
  const browser = await playwright.chromium.launch({
    headless: false,
    args: ['--disable-dev-shm-usage'],
  })
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()

  await page.setDefaultNavigationTimeout(0)

  await login(page)

  await verTodos(page)

  await comprobantesEnLinea(page)

  let pages = await context.pages()
  const facturadorPage = pages[1]

  await miPagina(facturadorPage)

  await generarComprobantes(facturadorPage)

  await seleccionarPuntoVenta(facturadorPage)

  await continuar(facturadorPage)

  await cargarConcepto(facturadorPage)

  await cargarIVAReceptor(facturadorPage)

  ({ detalle, valor } = await cargarItemFactura(facturadorPage))

  await confirmar(facturadorPage)

  await imprimirFactura(facturadorPage)

  saveToCSV(dateFormatted(), detalle, valor)

  await facturadorPage.waitForTimeout(1000)

  await browser.close()

  return { detalle, valor, fecha: dateFormatted() }
}

module.exports = { generar }
