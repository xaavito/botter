const { saveToFacturacion, launchBrowser } = require('../helpers/helper.js')

const { login } = require('../pages/login.js')
const { verTodos } = require('../pages/ver_todos.js')
const { comprobantesEnLinea } = require('../pages/comprobantes_en_linea.js')
const { miPagina } = require('../pages/mi_pagina.js')
const { consultas } = require('../pages/consultas.js')
const { seleccionarFechaDesde } = require('../pages/seleccionar_fecha_desde.js')
const { buscar } = require('../pages/buscar.js')
const { iterarTablaJig } = require('../pages/iterar_tabla.js')

const { menuPrincipal } = require('../pages/menu_principal.js')

async function listarOnline() {
  let resultados = []
  // disable headless to see the browser's action
  const browser = await launchBrowser()
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()

  await page.setDefaultNavigationTimeout(0)

  await login(page)

  await verTodos(page)

  await comprobantesEnLinea(page)

  let pages = await context.pages()
  const facturadorPage = pages[1]

  await miPagina(facturadorPage)

  await consultas(facturadorPage)

  await seleccionarFechaDesde(facturadorPage)

  await buscar(facturadorPage)

  resultados = await iterarTablaJig(facturadorPage)

  saveToFacturacion(resultados)

  await facturadorPage.waitForTimeout(1000)

  await menuPrincipal(facturadorPage)

  await browser.close()

  return;
}

module.exports = { listarOnline }
