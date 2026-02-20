const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')
const chalk = require('chalk')
const logger = require('./logger')

class ExcelProcessor {
  constructor(dataFolderPath = 'data') {
    this.dataFolderPath = dataFolderPath
    this.excelFile = null
    this.data = []
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
   * Procesa cada fila del Excel y genera facturas
   * @param {Function} generarCallback - Función callback para generar facturas
   * @returns {Array} Array de resultados
   */
  async procesarFilas(generarCallback) {
    if (!this.data || this.data.length === 0) {
      logger.error(chalk.red('No hay datos para procesar'))
      return []
    }

    const resultados = []

    // Iterar por cada fila del Excel
    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i]

      this.logRowInfo(i + 1, this.data.length, row)

      // Preparar datos para generar
      const datosNomindados = this.prepararDatos(row)

      // Generar factura para esta fila
      const resultado = await generarCallback({
        cantidad: 1,
        datos: datosNomindados,
      })

      if (resultado && resultado.length > 0) {
        resultados.push(...resultado)
      }

      logger.info(chalk.green(`✓ Fila ${i + 1} procesada exitosamente`))
    }

    logger.info(
      chalk.green.bold(
        `\n✓ Proceso completado: ${resultados.length} facturas generadas`
      )
    )

    return resultados
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
    }

    return datos
  }

  /**
   * Muestra información de la fila que se está procesando
   * @param {number} currentRow - Número de fila actual
   * @param {number} totalRows - Total de filas
   * @param {Array} row - Datos de la fila como array
   */
  logRowInfo(currentRow, totalRows, row) {
    logger.info(
      chalk.yellow(`\n--- Procesando fila ${currentRow} de ${totalRows} ---`)
    )

    // Leer por índice (ajustar según tu Excel)
    logger.info(chalk.cyan(`[0] CUIT Emisor: ${row[0] || 'N/A'}`))
    logger.info(chalk.cyan(`[1] Contraseña: ${row[1] ? '***' : 'N/A'}`))
    logger.info(chalk.cyan(`[2] CUIT Receptor: ${row[2] || 'N/A'}`))
    logger.info(chalk.cyan(`[3] Monto: ${row[3] || 'N/A'}`))
    logger.info(chalk.cyan(`[4] Modo de pago: ${row[4] || 'N/A'}`))
    logger.info(chalk.cyan(`[5] Tipo de factura: ${row[5] || 'N/A'}`))
    if (row[6]) {
      logger.info(chalk.cyan(`[6] Descripción: ${row[6]}`))
    }
  }

  /**
   * Ejecuta todo el proceso: buscar, leer y procesar el Excel
   * @param {Function} generarCallback - Función callback para generar facturas
   * @returns {Array} Array de resultados
   */
  async ejecutar(generarCallback) {
    // Buscar archivo Excel
    if (!this.findExcelFile()) {
      return []
    }

    // Leer archivo Excel
    this.readExcelFile()

    // Procesar filas
    const resultados = await this.procesarFilas(generarCallback)

    return resultados
  }
}

module.exports = { ExcelProcessor }
