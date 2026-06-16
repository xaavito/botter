const { generar } = require('./generar')
const { ExcelProcessor } = require('../helpers/excelProcessor')
const { getExcelDownloadsFolder } = require('../helpers/helper')
const AdmZip = require('adm-zip')
const fs = require('fs')
const path = require('path')
const logger = require('../helpers/logger')
const chalk = require('chalk')

async function excel() {
  const excelProcessor = new ExcelProcessor()
  const resultados = await excelProcessor.ejecutar(generar)

  // Zipear los archivos generados
  if (resultados && resultados.length > 0) {
    try {
      const runDate = excelProcessor.runDate
      const downloadsFolder = getExcelDownloadsFolder(runDate)
      
      // Verificar que la carpeta existe y tiene archivos
      if (fs.existsSync(downloadsFolder)) {
        const files = fs.readdirSync(downloadsFolder).filter(file => file.endsWith('.pdf'))
        
        if (files.length > 0) {
          logger.info(chalk.cyan(`\n📦 Comprimiendo ${files.length} archivos...`))
          
          // Crear el archivo zip
          const zip = new AdmZip()
          
          // Agregar todos los archivos PDF al zip
          files.forEach(file => {
            const filePath = path.join(downloadsFolder, file)
            zip.addLocalFile(filePath)
          })
          
          // Guardar el zip en la carpeta downloads con el nombre de la fecha
          const zipPath = path.join(process.cwd(), 'data', 'downloads', `facturas_${runDate}.zip`)
          zip.writeZip(zipPath)
          
          logger.info(chalk.green(`✓ Archivo ZIP creado exitosamente: ${zipPath}`))
          logger.info(chalk.green(`✓ Total de archivos comprimidos: ${files.length}`))
        } else {
          logger.warn(chalk.yellow('⚠️  No se encontraron archivos PDF para comprimir'))
        }
      }
    } catch (error) {
      logger.error(chalk.red('❌ Error al crear archivo ZIP:'), error)
      // No fallar todo el proceso por un error al zipear
    }
  }

  return resultados
}

module.exports = { excel }
