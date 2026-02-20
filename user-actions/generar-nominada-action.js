const inquirer = require('inquirer')
const { generar } = require('../generar.js')
const { readFromFile } = require('../helpers/helper.js')
const { facturacionMensual } = require('./facturacion-mensual-action.js')

const generarNominadaAction = async () => {
  const questions = []
  const users = readFromFile()

  questions.push({
    type: 'list',
    name: 'user',
    message: 'Seleccione un usuario:',
    choices: users,
  })
  questions.push({
    type: 'input',
    name: 'amount',
    message: 'Ingrese el monto:',
  })
  const datosNomindados = await inquirer.prompt(questions)

  const resultados = await generar({
    cantidad: 1,
    datos: datosNomindados,
  })

  await facturacionMensual()
  return resultados
}

module.exports = { generarNominadaAction }
