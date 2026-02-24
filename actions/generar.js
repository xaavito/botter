const { dateFormatted, saveToCSV, launchBrowser } = require('../helpers/helper.js')

const { login } = require('../pages/login.js')
const { verTodos } = require('../pages/ver_todos.js')
const { comprobantesEnLinea } = require('../pages/comprobantes_en_linea.js')
const { generarComprobantes } = require('../pages/generar_comprobantes.js')
const { seleccionarPuntoVenta, seleccionarEmpresa } = require('../pages/seleccionar_pto_vta.js')

const { continuar } = require('../pages/continuar.js')
const { cargarConcepto } = require('../pages/cargar_concepto.js')
const { cargarIVAReceptor } = require('../pages/cargar_iva_receptor.js')
const { cargarItemFactura } = require('../pages/cargar_item_factura.js')
const { confirmar } = require('../pages/confirmar.js')
const { confirmarDialogo } = require('../pages/confirmarDialogo.js')
const { imprimirFactura } = require('../pages/imprimir_factura.js')
const { menuPrincipal } = require('../pages/menu_principal.js')

async function generar({ cantidad = 1, datos = null}) {
  let resultados = []
  // disable headless to see the browser's action
  const browser = await launchBrowser()
  const context = await browser.newContext({ acceptDownloads: true })
  const page = await context.newPage()

  await page.setDefaultNavigationTimeout(0)

  await login(page, datos)

  await verTodos(page)

  await comprobantesEnLinea(page)

  let pages = await context.pages()
  const facturadorPage = pages[1]

  await seleccionarEmpresa(facturadorPage)

  for (let index = 1; index <= cantidad; index++) {
    await generarComprobantes(facturadorPage)

    await seleccionarPuntoVenta(facturadorPage)

    await continuar(facturadorPage)

    await cargarConcepto(facturadorPage, datos)

    await cargarIVAReceptor(facturadorPage, datos)

    const itemsFactura = await cargarItemFactura(
      facturadorPage,
      datos
    )

    resultados.push({
      detalle: itemsFactura.detalle,
      valor: itemsFactura.valor,
      fecha: dateFormatted(),
    })

    await confirmar(facturadorPage)

    await confirmarDialogo(facturadorPage)

    await imprimirFactura(facturadorPage, datos)

    saveToCSV(datos, dateFormatted(), itemsFactura.detalle, itemsFactura.valor)

    await facturadorPage.waitForTimeout(1000)

    await menuPrincipal(facturadorPage)
  }

  await browser.close()

  return resultados
}

module.exports = { generar }
