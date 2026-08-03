const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')
const chalk = require('chalk')
const logger = require('./logger')
const { dateAsString } = require('./helper')

class ExcelProcessor {
  constructor(dataFolderPath = '../data') {
    this.dataFolderPath = dataFolderPath
    this.excelFile = null
    this.data = []
    this.maxRetries = 2 // Número máximo de reintentos
    this.runDate = dateAsString() // Fecha de corrida en formato YYYYMMDD
    this.errores = [] // Detalle de filas que fallaron en la última corrida
  }

  /**
   * Busca el archivo Excel en la carpeta data
   * @returns {string|null} Nombre del archivo Excel encontrado o null
   */
  findExcelFile() {
    const dataFolder = path.join(__dirname, this.dataFolderPath)

    if (!fs.existsSync(dataFolder)) {
      logger.error(chalk.red(`La carpeta ${this.dataFolderPath} no existe`))
      return null
    }

    const files = fs.readdirSync(dataFolder)
    this.excelFile = files.find(
      (file) => file.endsWith('.xlsx') || file.endsWith('.xls')
    )

    if (!this.excelFile) {
      logger.error(
        chalk.red('No se encontró ningún archivo Excel en la carpeta data')
      )
      return null
    }

    logger.info(chalk.blue(`Leyendo archivo: ${this.excelFile}`))
    return this.excelFile
  }

  /**
   * Lee el archivo Excel y convierte los datos a JSON
   * @returns {Array} Array de arrays (filas) con los datos del Excel
   */
  readExcelFile() {
    if (!this.excelFile) {
      logger.error(chalk.red('No hay archivo Excel para leer'))
      return []
    }

    const filePath = path.join(__dirname, this.dataFolderPath, this.excelFile)
    const workbook = xlsx.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convertir a array de arrays (sin encabezados, solo valores)
    // header: 1 significa que cada fila es un array
    this.data = xlsx.utils.sheet_to_json(worksheet, { header: 1 })

    // Remover la primera fila (encabezados) si existe
    if (this.data.length > 0) {
      this.headers = this.data.shift() // Guardar encabezados
      logger.info(chalk.magenta(`\n📋 Encabezados: ${this.headers.join(', ')}`))
    }

    // Filtrar filas vacías (arrays vacíos o con todos valores undefined/null)
    this.data = this.data.filter((row) => {
      // Verificar que el array no esté vacío y tenga al menos un valor no vacío
      return (
        row &&
        row.length > 0 &&
        row.some((cell) => cell !== undefined && cell !== null && cell !== '')
      )
    })

    logger.info(
      chalk.blue(`Se encontraron ${this.data.length} filas para procesar`)
    )

    return this.data
  }

  /**
   * Procesa cada fila del Excel y genera facturas con lógica de reintentos
   * @param {Function} generarCallback - Función callback para generar facturas
   * @returns {Array} Array de resultados
   */
  async procesarFilas(generarCallback) {
    if (!this.data || this.data.length === 0) {
      logger.error(chalk.red('No hay datos para procesar'))
      return []
    }

    const resultados = []
    const errores = []

    // Iterar por cada fila del Excel
    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i]
      const datosNomindados = this.prepararDatos(row)
      
      let exito = false
      let ultimoError = null

      // Validar que la fila tenga todos los datos necesarios ANTES de intentar procesar
      // Si falta algún dato, la fila NO se procesa ni se reintenta, solo se informa y se continúa
      const camposFaltantes = this.obtenerCamposFaltantes(datosNomindados)
      if (camposFaltantes.length > 0) {
        const mensajeError = `Fila incompleta, faltan datos en: ${camposFaltantes.join(', ')}`
        logger.warn(
          chalk.yellow(
            `⚠️  Fila ${i + 1} omitida (no se procesará): ${mensajeError}`
          )
        )
        errores.push({
          fila: i + 1,
          cuitEmisor: datosNomindados.cuitEmisor,
          cuitReceptor: datosNomindados.user,
          monto: datosNomindados.amount,
          error: mensajeError,
          intentos: 0,
        })
        continue // Saltar a la siguiente fila, sin procesar ni reintentar
      }

      // Validar CUIT del receptor ANTES de intentar procesar
      try {
        this.validarCUITReceptor(datosNomindados.user)
      } catch (validationError) {
        logger.error(
          chalk.red(
            `❌ Error de validación en fila ${i + 1}: ${validationError.message}`
          )
        )
        errores.push({
          fila: i + 1,
          cuitEmisor: datosNomindados.cuitEmisor,
          cuitReceptor: datosNomindados.user,
          monto: datosNomindados.amount,
          error: validationError.message,
          intentos: 0,
        })
        continue // Saltar a la siguiente fila
      }


      // Intentar procesar la fila con reintentos
      for (let intento = 0; intento <= this.maxRetries && !exito; intento++) {
        try {
          if (intento > 0) {
            logger.info(
              chalk.yellow(
                `🔄 Reintento ${intento} de ${this.maxRetries} para fila ${i + 1}`
              )
            )
          }

          this.logRowInfo(i + 1, this.data.length, row)

          const resultado = await generarCallback({
            cantidad: 1,
            datos: datosNomindados,
          })

          if (resultado && resultado.length > 0) {
            resultados.push(...resultado)
          }

          logger.info(
            chalk.green(`✓ Fila ${i + 1} procesada y factura confirmada exitosamente`)
          )
          exito = true
        } catch (error) {
          ultimoError = error
          const errorDetalle = this.extraerInfoError(error)

          // Verificar si el error ocurrió después de confirmar
          // Si la factura fue confirmada, NO reintentar
          if (error.confirmacionExitosa) {
            logger.error(
              chalk.red(
                `❌ Error en fila ${i + 1} después de confirmar. No se reintentará.`
              )
            )
            logger.error(chalk.red(`   Detalle: ${errorDetalle}`))
            break // Salir del loop de reintentos
          }

          // Verificar si el error no debe reintentarse (errores de permisos, validación, etc.)
          if (error.noReintentar) {
            logger.error(
              chalk.red(
                `❌ Error en fila ${i + 1}. No se reintentará (error de configuración/permisos).`
              )
            )
            logger.error(chalk.red(`   Detalle: ${errorDetalle}`))
            break // Salir del loop de reintentos
          }

          // Si no fue confirmada y quedan reintentos, continuar
          if (intento < this.maxRetries) {
            logger.warn(
              chalk.yellow(
                `⚠️  Error en fila ${i + 1} (intento ${intento + 1}). Reintentando...`
              )
            )
            logger.warn(chalk.yellow(`   Detalle: ${errorDetalle}`))
          } else {
            logger.error(
              chalk.red(
                `❌ Error en fila ${i + 1} después de ${this.maxRetries + 1} intentos`
              )
            )
            logger.error(chalk.red(`   Detalle: ${errorDetalle}`))
          }
        }
      }

      // Si no tuvo éxito después de todos los intentos, registrar el error
      if (!exito && ultimoError) {
        const errorInfo = {
          fila: i + 1,
          cuitEmisor: datosNomindados.cuitEmisor,
          cuitReceptor: datosNomindados.user,
          monto: datosNomindados.amount,
          error: this.extraerInfoError(ultimoError),
          intentos: ultimoError.confirmacionExitosa || ultimoError.noReintentar 
            ? 1 
            : this.maxRetries + 1,
        }
        errores.push(errorInfo)
      }
    }

    logger.info(
      chalk.green.bold(
        `\n✓ Proceso completado: ${resultados.length} facturas generadas`
      )
    )

    // Mostrar errores de forma legible
    if (errores.length > 0) {
      logger.info(chalk.red.bold(`\n❌ Total de errores: ${errores.length}`))
      errores.forEach((err, index) => {
        logger.error(
          chalk.red(
            `❌ Error ${index + 1}: Fila ${err.fila} | Emisor: ${err.cuitEmisor} | Receptor: ${err.cuitReceptor} | Monto: ${err.monto} | Intentos: ${err.intentos} | ${err.error}`
          )
        )
      })
    } else {
      logger.info(chalk.green.bold('\n✓ Sin errores'))
    }

    // Guardar el detalle de errores en la instancia para poder consultarlo
    // luego de ejecutar() (por ejemplo, para armar un resumen ejecutivo)
    this.errores = errores

    // Mostrar resumen ejecutivo final: cuántas OK, cuántas fallaron y el
    // detalle de cada fila con error (para que puedan revisarse manualmente)
    this.mostrarResumenEjecutivo(this.data.length, resultados.length, errores)

    return resultados
  }

  /**
   * Muestra un resumen ejecutivo final del procesamiento:
   * total de filas, cuántas se generaron OK y el detalle de las que fallaron
   * (para que puedan revisarse manualmente)
   * @param {number} totalFilas - Total de filas leídas del Excel
   * @param {number} totalOk - Total de facturas generadas exitosamente
   * @param {Array} errores - Detalle de errores por fila
   */
  mostrarResumenEjecutivo(totalFilas, totalOk, errores) {
    const totalFallidas = errores.length

    logger.info(chalk.cyan.bold('\n════════════════════════════════════════'))
    logger.info(chalk.cyan.bold('   📊 RESUMEN EJECUTIVO'))
    logger.info(chalk.cyan.bold('════════════════════════════════════════'))
    logger.info(chalk.white(`   Total de filas procesadas: ${totalFilas}`))
    logger.info(chalk.green(`   ✓ Facturas generadas OK:   ${totalOk}`))
    logger.info(chalk.red(`   ✗ Filas con error:         ${totalFallidas}`))

    if (totalFallidas > 0) {
      logger.info(chalk.yellow.bold('\n   ⚠️  Filas a revisar manualmente:'))
      errores.forEach((err) => {
        logger.info(
          chalk.yellow(
            `   • Fila ${err.fila} | Emisor: ${err.cuitEmisor || 'N/A'} | Receptor: ${err.cuitReceptor || 'N/A'} | Monto: ${err.monto || 'N/A'} | Motivo: ${err.error}`
          )
        )
      })
    }

    logger.info(chalk.cyan.bold('════════════════════════════════════════\n'))
  }

  /**
   * Convierte un valor a string de forma segura
   * @param {any} value - Valor a convertir
   * @returns {string} Valor convertido a string o string vacío si es null/undefined
   */
  toStringSeguro(value) {
    if (value === null || value === undefined) {
      return ''
    }
    return String(value).trim()
  }

  /**
   * Prepara los datos de una fila para ser procesados
   * Lee los datos por posición/orden de columnas (índice del array)
   * Convierte todos los valores a string
   * @param {Array} row - Fila del Excel como array de valores
   * @returns {Object} Datos preparados con todos los valores como string
   */
  prepararDatos(row) {
    // Leer por índice de columna (orden en el Excel)
    // Ajusta estos índices según tu Excel:
    // [0]=CUIT Emisor, [1]=Contraseña, [2]=CUIT Receptor, [3]=Monto, [4]=Modo Pago, [5]=Tipo Factura, [6]=Descripción
    const datos = {
      cuitEmisor: this.toStringSeguro(row[0]), // Columna A
      password: this.toStringSeguro(row[1]), // Columna B
      user: this.toStringSeguro(row[2]), // Columna C
      amount: this.toStringSeguro(row[3]), // Columna D
      modoPago: this.toStringSeguro(row[4]), // Columna E
      tipoFactura: this.toStringSeguro(row[5]), // Columna F
      descripcionItem: this.toStringSeguro(row[6]), // Columna G
      ivaReceptor: this.toStringSeguro(row[7]), // Columna H
      tipoGeneracion: 'excel', // Indica que es generación desde Excel
      runDate: this.runDate, // Fecha de corrida para organizar archivos
    }

    return datos
  }

  /**
   * Determina qué campos obligatorios faltan en los datos de una fila
   * Si falta algún dato requerido, la fila no debe procesarse ni reintentarse
   * @param {Object} datos - Datos preparados de la fila (resultado de prepararDatos)
   * @returns {Array<string>} Array con los nombres de los campos faltantes (vacío si no falta nada)
   */
  obtenerCamposFaltantes(datos) {
    // Campos obligatorios para poder generar una factura
    const camposRequeridos = [
      { campo: 'cuitEmisor', label: 'CUIT Emisor' },
      { campo: 'password', label: 'Contraseña' },
      { campo: 'user', label: 'CUIT Receptor' },
      { campo: 'amount', label: 'Monto' },
      { campo: 'modoPago', label: 'Modo de Pago' },
      { campo: 'tipoFactura', label: 'Tipo de Factura' },
      { campo: 'ivaReceptor', label: 'IVA Receptor' },
    ]

    const faltantes = []
    for (const { campo, label } of camposRequeridos) {
      const valor = datos[campo]
      if (valor === undefined || valor === null || String(valor).trim() === '') {
        faltantes.push(label)
      }
    }

    return faltantes
  }

  /**
   * Valida que el CUIT/CUIL del receptor tenga exactamente 11 caracteres
   * @param {string} cuit - CUIT/CUIL a validar
   * @throws {Error} Si el CUIT no tiene 11 caracteres
   */
  validarCUITReceptor(cuit) {
    // Remover guiones y espacios para contar solo dígitos
    const cuitLimpio = cuit.replace(/[-\s]/g, '')
    
    if (cuitLimpio.length !== 11) {
      throw new Error(
        `El CUIT/CUIL del receptor debe tener exactamente 11 caracteres. ` +
        `CUIT proporcionado: "${cuit}" (${cuitLimpio.length} caracteres)`
      )
    }
  }

  /**
   * Muestra información de la fila que se está procesando
   * @param {number} currentRow - Número de fila actual
   * @param {number} totalRows - Total de filas
   * @param {Array} row - Datos de la fila como array
   */
  logRowInfo(currentRow, totalRows, row) {
    // Formatear todos los datos en una sola línea
    const datos = [
      `Emisor: ${row[0] || 'N/A'}`,
      `Receptor: ${row[2] || 'N/A'}`,
      `Monto: ${row[3] || 'N/A'}`,
      `Pago: ${row[4] || 'N/A'}`,
      `Tipo: ${row[5] || 'N/A'}`,
      row[6] ? `Desc: ${row[6]}` : null,
    ]
      .filter(Boolean)
      .join(' | ')

    logger.info(
      chalk.yellow(
        `\n--- Fila ${currentRow}/${totalRows} --- ${chalk.cyan(datos)}`
      )
    )
  }

  /**
   * Extrae información útil del stack trace para identificar dónde falló
   * @param {Error} error - Error capturado
   * @returns {string} Información formateada del stack trace
   */
  extraerInfoError(error) {
    if (!error.stack) return error.message || 'Error desconocido'

    const stack = error.stack.split('\n')
    const mensaje = error.message || 'Error desconocido'

    // Buscar la primera línea del stack que contenga info de archivo (no node_modules)
    const lineaRelevante = stack
      .slice(1) // Saltar la primera línea que es el mensaje
      .find((line) => {
        return (
          line.includes('/pages/') ||
          line.includes('/actions/') ||
          line.includes('/helpers/')
        )
      })

    if (lineaRelevante) {
      // Extraer nombre del archivo y número de línea
      const match = lineaRelevante.match(/\/(pages|actions|helpers)\/([^:)]+):(\d+)/)
      if (match) {
        const [, carpeta, archivo, linea] = match
        return `${mensaje} [${carpeta}/${archivo}:${linea}]`
      }
    }

    return mensaje
  }

  /**
   * Ejecuta todo el proceso: buscar, leer y procesar el Excel
   * @param {Function} generarCallback - Función callback para generar facturas
   * @returns {Array} Array de resultados
   */
  async ejecutar(generarCallback) {
    // ⏱️ INICIO: Medir tiempo de ejecución
    const tiempoInicio = Date.now()
    logger.info(chalk.cyan('⏱️  Iniciando proceso de Excel...'))

    // Buscar archivo Excel
    if (!this.findExcelFile()) {
      return []
    }

    // Leer archivo Excel
    this.readExcelFile()

    // Procesar filas
    const resultados = await this.procesarFilas(generarCallback)

    // ⏱️ FIN: Calcular y mostrar tiempo total
    const tiempoFin = Date.now()
    const tiempoTotal = tiempoFin - tiempoInicio
    this.mostrarTiempoEjecucion(tiempoTotal)

    return resultados
  }

  /**
   * Formatea y muestra el tiempo total de ejecución
   * @param {number} milisegundos - Tiempo en milisegundos
   */
  mostrarTiempoEjecucion(milisegundos) {
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

    logger.info(
      chalk.cyan.bold(
        `\n⏱️  TIEMPO TOTAL DE EJECUCIÓN: ${tiempoFormateado.trim()}`
      )
    )
    logger.info(
      chalk.cyan(`   (${milisegundos.toLocaleString()} milisegundos)`)
    )
  }
}

module.exports = { ExcelProcessor }
