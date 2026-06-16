const {
  dateFormatted,
  saveToCSV,
  launchBrowser,
  getExcelDownloadsFolder,
} = require('../helpers/helper.js')
const logger = require('../helpers/logger.js')
const path = require('path')
const fs = require('fs')

const { login } = require('../pages/login.js')
const { verTodos } = require('../pages/ver_todos.js')
const { comprobantesEnLinea } = require('../pages/comprobantes_en_linea.js')
const { generarComprobantes } = require('../pages/generar_comprobantes.js')
const {
  seleccionarPuntoVenta,
  seleccionarEmpresa,
} = require('../pages/seleccionar_pto_vta.js')

const { continuar } = require('../pages/continuar.js')
const { cargarConcepto } = require('../pages/cargar_concepto.js')
const { cargarIVAReceptor } = require('../pages/cargar_iva_receptor.js')
const { cargarItemFactura } = require('../pages/cargar_item_factura.js')
const { confirmar } = require('../pages/confirmar.js')
const { confirmarDialogo } = require('../pages/confirmarDialogo.js')
const { imprimirFactura } = require('../pages/imprimir_factura.js')
const { menuPrincipal } = require('../pages/menu_principal.js')

/**
 * Genera facturas en AFIP mediante automatización de browser
 * @param {Object} options - Opciones de generación
 * @param {number} [options.cantidad=1] - Cantidad de facturas a generar
 * @param {Object|null} [options.datos=null] - Datos específicos para factura nominada
 * @param {string} [options.datos.cuitEmisor] - CUIT del emisor
 * @param {string} [options.datos.password] - Contraseña del emisor
 * @param {string} [options.datos.user] - CUIT del receptor
 * @param {string} [options.datos.amount] - Monto de la factura
 * @param {string} [options.datos.modoPago] - Modo de pago
 * @param {string} [options.datos.tipoFactura] - Tipo de factura
 * @param {string} [options.datos.descripcionItem] - Descripción del item
 * @param {string} [options.datos.ivaReceptor] - Condición IVA del receptor
 * @param {string} [options.datos.runDate] - Fecha de corrida para organizar archivos (formato YYYYMMDD)
 * @returns {Promise<Array<{detalle: string, valor: number, fecha: string}>>} Resultados de facturas generadas
 * @throws {Error} Si falla la autenticación o generación
 */
async function generar({ cantidad = 1, datos = null }) {
  let browser
  let resultados = []
  
  // ⏱️ INICIO: Medir tiempo de ejecución
  const tiempoInicio = Date.now()
  logger.info(`⏱️  Iniciando generación de ${cantidad} factura(s)...`)

  try {
    // disable headless to see the browser's action
    browser = await launchBrowser()

    // Determinar la carpeta de descargas según el tipo de generación
    const isExcel = datos && datos.tipoGeneracion === 'excel'
    const runDate = datos && datos.runDate ? datos.runDate : null
    
    let downloadsPath
    if (isExcel && runDate) {
      // Modo Excel con carpeta por fecha
      downloadsPath = getExcelDownloadsFolder(runDate)
    } else if (isExcel) {
      // Modo Excel sin carpeta por fecha
      downloadsPath = path.join(process.cwd(), 'data/downloads')
    } else {
      // Modo normal
      downloadsPath = path.join(process.cwd(), 'invoices')
    }

    // Asegurar que la carpeta existe
    if (!fs.existsSync(downloadsPath)) {
      fs.mkdirSync(downloadsPath, { recursive: true })
    }

    const context = await browser.newContext({
      acceptDownloads: true,
      downloadsPath: downloadsPath,
    })
    const page = await context.newPage()

    await page.setDefaultNavigationTimeout(0)

    await login(page, datos)

    await verTodos(page)

    await comprobantesEnLinea(page)

    let pages = await context.pages()
    const facturadorPage = pages[1]

    await seleccionarEmpresa(facturadorPage)

    for (let index = 1; index <= cantidad; index++) {
      let confirmacionExitosa = false

      try {
        await generarComprobantes(facturadorPage)

        await seleccionarPuntoVenta(facturadorPage)

        await continuar(facturadorPage)

        await cargarConcepto(facturadorPage, datos)

        await cargarIVAReceptor(facturadorPage, datos)

        const itemsFactura = await cargarItemFactura(facturadorPage, datos)

        resultados.push({
          detalle: itemsFactura.detalle,
          valor: itemsFactura.valor,
          fecha: dateFormatted(),
        })

        await confirmar(facturadorPage)

        await confirmarDialogo(facturadorPage)

        // Marcar que la confirmación fue exitosa
        confirmacionExitosa = true

        await imprimirFactura(facturadorPage, datos)

        logger.info('✓ Factura confirmada e impresa exitosamente')

        // Solo guardar en CSV si NO es generación desde Excel
        if (!datos || datos.tipoGeneracion !== 'excel') {
          saveToCSV(
            datos,
            dateFormatted(),
            itemsFactura.detalle,
            itemsFactura.valor
          )
        }

        await facturadorPage.waitForTimeout(1000)

        await menuPrincipal(facturadorPage)
      } catch (error) {
        // Si la confirmación fue exitosa, marcar el error para evitar reintentos
        if (confirmacionExitosa) {
          error.confirmacionExitosa = true
          logger.error(
            'Error después de confirmar la factura (no se reintentará)'
          )
        }
        throw error
      }
    }

    // ⏱️ FIN: Calcular y mostrar tiempo total
    const tiempoFin = Date.now()
    const tiempoTotal = tiempoFin - tiempoInicio
    mostrarTiempoEjecucion(tiempoTotal, cantidad)

    return resultados
  } catch (error) {
    logger.error('Error generando facturas:', error)
    throw error
  } finally {
    if (browser) {
      await browser
        .close()
        .catch((err) => logger.error('Error cerrando browser:', err))
    }
  }
}

/**
 * Formatea y muestra el tiempo total de ejecución
 * @param {number} milisegundos - Tiempo en milisegundos
 * @param {number} cantidad - Cantidad de facturas generadas
 */
function mostrarTiempoEjecucion(milisegundos, cantidad) {
  const segundos = Math.floor(milisegundos / 1000)
  const minutos = Math.floor(segundos / 60)
  const horas = Math.floor(minutos / 60)

  const ms = milisegundos % 1000
  const segs = segundos % 60
  const mins = minutos % 60

  let tiempoFormateado = ''

  if (horas > 0) {
    tiempoFormateado += `${horas}h `
  }
  if (minutos > 0) {
    tiempoFormateado += `${mins}m `
  }
  if (segundos > 0 || milisegundos < 1000) {
    tiempoFormateado += `${segs}s `
  }
  tiempoFormateado += `${ms}ms`

  logger.info(`\n⏱️  TIEMPO TOTAL: ${tiempoFormateado.trim()}`)
  logger.info(`   ${cantidad} factura(s) generada(s)`)
  
  if (cantidad > 1) {
    const tiempoPorFactura = Math.round(milisegundos / cantidad)
    const segPorFactura = (tiempoPorFactura / 1000).toFixed(1)
    logger.info(`   Promedio: ${segPorFactura}s por factura`)
  }
}

module.exports = { generar }
