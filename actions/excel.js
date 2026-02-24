const { generar } = require('./generar')
const { listar } = require('./listar')
const { listarOnline } = require('./listarOnline')
const logger = require('./logger')
const { writeToFile, readFromFile } = require('./helper.js')
const { ExcelProcessor } = require('./excelProcessor')

async function excel() {
  const excelProcessor = new ExcelProcessor()
  resultados = await excelProcessor.ejecutar(generar)

  return resultados
}
