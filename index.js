#!/usr/bin/env node.

const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
//const shell = require('shelljs')

const GENERAR = 'generate factura random'
const LISTAR = 'listar facturas realizadas a la fecha'
const FACTURACION_MENSUAL = 'Ver Facturacion Mensual'
const FACTURACION_ANUAL = 'Ver Facturacion Anual'

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
      choices: [GENERAR, FACTURACION_MENSUAL, FACTURACION_ANUAL],
    },
  ]
  return inquirer.prompt(questions)
}

const callToAction = async (action) => {
  let values
  if (action === GENERAR) {
    values = await generar()
    // corremos ademas que nos muestre cuanto viene facturando mes a mes
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
  return values
}

const success = async (result, values) => {
  logger.info(
    chalk.white.bgGreen.bold(`Listo! accion finalizada!!!! ${result}`)
  )
  if (result.includes('generate')) {
    logger.info(
      chalk.white.bgGreen.bold(
        `Factura generada el dia ${values.fecha}, detalle ${values.detalle}, valor ${values.valor}`
      )
    )
  }
}

const facturacionMensual = async () => {
  await listar('mensual')
}

const facturacionAnual = async () => {
  await listar('anual')
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
  const result = await callToAction(selection)
  // show success message
  await success(selection, result)
}

run()
