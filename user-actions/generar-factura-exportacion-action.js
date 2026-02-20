const inquirer = require('inquirer')
const { generar } = require('../generar')

const generarFacturaExportacionAction = async () => {
  const questions = []
  questions.push({
    type: 'input',
    name: 'amount',
    message: 'Ingrese el monto:',
  })
  const datosFacturaExportacion = await inquirer.prompt(questions)
  const resultados = await generar({
    cantidad: 1,
    exportacion: true,
    datos: datosFacturaExportacion,
  })
  return resultados
}

module.exports = { generarFacturaExportacionAction }
