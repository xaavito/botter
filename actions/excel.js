const { generar } = require('./generar')

const { ExcelProcessor } = require('../helpers/excelProcessor')

async function excel() {
  const excelProcessor = new ExcelProcessor()
  const resultados = await excelProcessor.ejecutar(generar)

  return resultados;
}


module.exports = { excel }