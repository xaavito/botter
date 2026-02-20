const inquirer = require('inquirer')
const { generar } = require('../actions/generar')
const { facturacionMensual } = require('./facturacion-mensual-action')

const generarMasAction = async () => {
  const resultado = await inquirer.prompt([
    {
      name: 'cantidadAGenerar',
      message: 'Cuantas necesitas generar?',
      type: 'input',
    },
  ])

  const resultados = await generar({ cantidad: resultado.cantidadAGenerar })

  await facturacionMensual()
  return resultados
}

module.exports = { generarMasAction }
