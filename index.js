#!/usr/bin/env node.
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const {
  GENERAR,
  GENERAR_MAS,
  GENERAR_NOMINADA,
  GENERAR_FACTURA_EXPORTACION,
  FACTURACION_MENSUAL,
  FACTURACION_ANUAL,
  FACTURACION_ANUAL_ANTERIOR,
  DESCARGAR_FACTURACION_ANUAL,
  INSERTAR_USUARIO,
  EXCEL
} = require('./helpers/constants.js')

const logger = require('./helpers/logger.js')
const { actionMap } = require('./user-actions/index.js')

const init = async () => {
  // Si usamos el logger sale raro...
  // eslint-disable-next-line no-console
  console.log(
    chalk.green(
      figlet.textSync('Bottteeeerrr', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  )
}

const askQuestions = async () => {
  const questions = [
    {
      type: 'list',
      name: 'selection',
      message: 'Que queres que Botter haga por ti??',
      choices: [
        GENERAR,
        GENERAR_MAS,
        GENERAR_NOMINADA,
        GENERAR_FACTURA_EXPORTACION,
        FACTURACION_MENSUAL,
        FACTURACION_ANUAL,
        FACTURACION_ANUAL_ANTERIOR,
        DESCARGAR_FACTURACION_ANUAL,
        INSERTAR_USUARIO,
        EXCEL
      ],
    },
  ]

  return inquirer.prompt(questions)
}

const callToAction = async (action) => {
  // Buscar la acción en el mapa
  const actionFunction = actionMap[action]

  if (!actionFunction) {
    logger.error(`Acción no encontrada: ${action}`)
    return null
  }

  // Ejecutar la acción correspondiente
  return await actionFunction()
}

const success = async (seleccion, resultados) => {
  logger.info(
    chalk.white.bgGreen.bold(`Listo! accion finalizada!!!! ${seleccion}`)
  )
  if (seleccion.includes('generate')) {
    for (let index = 0; index < resultados.length; index++) {
      const resultado = resultados[index]
      logger.info(
        chalk.white.bgGreen.bold(
          `Factura generada el dia ${resultado.fecha}, detalle ${resultado.detalle}, valor ${resultado.valor}`
        )
      )
    }
  }
}


const run = async () => {
  // show script introduction
  await init()
  // ask questions
  const { selection } = await askQuestions()
  logger.info(
    chalk.white.bgRed.bold(
      `Realizando accion ${selection}, por favor espere....`
    )
  )
  // do stuff with input
  // maybe we should primisfy all and return actual status
  const resultados = await callToAction(selection)
  // show success message
  await success(selection, resultados)
}

run()
