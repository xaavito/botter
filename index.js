#!/usr/bin/env node.
//const input = require('input');
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const {
  GENERAR,
  GENERAR_MAS,
  GENERAR_NOMINADA,
  LISTAR,
  FACTURACION_MENSUAL,
  FACTURACION_ANUAL,
  FACTURACION_ANUAL_ANTERIOR,
} = require('./constants')

const { generar } = require('./generar')
const { listar } = require('./listar')
const logger = require('./logger')

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
        FACTURACION_MENSUAL,
        FACTURACION_ANUAL,
        FACTURACION_ANUAL_ANTERIOR,
      ],
    },
  ]
  return inquirer.prompt(questions)
}

const callToAction = async (action) => {
  let resultados
  if (action === GENERAR) {
    resultados = await generar({ action })
    // corremos ademas que nos muestre cuanto viene facturando mes a mes
    await facturacionMensual()
  }
  if (action === GENERAR_MAS) {
    const resultado = await inquirer.prompt([
      {
        name: 'greeting',
        message: 'Cuantas necesitas generar?',
        type: 'input',
      },
    ])

    resultados = await generar({ input: resultado.greeting, action })

    await facturacionMensual()
  }
  if (action === GENERAR_NOMINADA) {
    const resultado = await inquirer.prompt([
      {
        name: 'greeting',
        message: 'Escriba CUIT a generar, separado por un espacio el monto',
        type: 'input',
      },
    ])

    resultados = await generar({
      input: resultado.greeting,
      action,
    })

    await facturacionMensual()
  }
  if (action === LISTAR) {
    await listar()
  }
  if (action === FACTURACION_MENSUAL) {
    await facturacionMensual()
  }
  if (action === FACTURACION_ANUAL) {
    await facturacionAnual()
  }
  if (action === FACTURACION_ANUAL_ANTERIOR) {
    await facturacionAnualAnterior()
  }
  return resultados
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

const facturacionMensual = async () => {
  await listar('mensual')
}

const facturacionAnual = async () => {
  await listar('anual')
}

const facturacionAnualAnterior = async () => {
  await listar('anualAnterior')
}

const run = async () => {
  // resumen
  //await facturacionAnual()
  //await facturacionMensual()
  //logger.info(
  //`Tener en cuenta el tope mensual por favorrrr ${process.env.TOPE_FACTURACION_MENSUAL}`
  //)

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
