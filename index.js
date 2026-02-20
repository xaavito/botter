#!/usr/bin/env node.
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const {
  GENERAR,
  GENERAR_MAS,
  GENERAR_NOMINADA,
  GENERAR_FACTURA_EXPORTACION,
  LISTAR,
  FACTURACION_MENSUAL,
  FACTURACION_ANUAL,
  FACTURACION_ANUAL_ANTERIOR,
  DESCARGAR_FACTURACION_ANUAL,
  INSERTAR_USUARIO,
  EXCEL,
} = require('./constants.js')

const { generar } = require('./generar')
const { listar } = require('./listar')
const { listarOnline } = require('./listarOnline')
const logger = require('./logger')
const { writeToFile, readFromFile } = require('./helper.js')
const { ExcelProcessor } = require('./excelProcessor')

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
        EXCEL,
        GENERAR_MAS,
        GENERAR_NOMINADA,
        GENERAR_FACTURA_EXPORTACION,
        FACTURACION_MENSUAL,
        FACTURACION_ANUAL,
        FACTURACION_ANUAL_ANTERIOR,
        DESCARGAR_FACTURACION_ANUAL,
        INSERTAR_USUARIO,
      ],
    },
  ]

  return inquirer.prompt(questions)
}

const callToAction = async (action) => {
  let resultados
  if (action === GENERAR) {
    resultados = await generar({ cantidad: 1 })
    // corremos ademas que nos muestre cuanto viene facturando mes a mes
    await facturacionMensual()
  }
  if (action === GENERAR_MAS) {
    const resultado = await inquirer.prompt([
      {
        name: 'cantidadAGenerar',
        message: 'Cuantas necesitas generar?',
        type: 'input',
      },
    ])

    resultados = await generar({ cantidad: resultado.cantidadAGenerar })

    await facturacionMensual()
  }
  if (action === GENERAR_NOMINADA) {
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

    resultados = await generar({
      cantidad: 1,
      datos: datosNomindados,
    })

    await facturacionMensual()
  }
  if (action === GENERAR_FACTURA_EXPORTACION) {
    const questions = []
    questions.push({
      type: 'input',
      name: 'amount',
      message: 'Ingrese el monto:',
    })
    const datosFacturaExportacion = await inquirer.prompt(questions)
    resultados = await generar({
      cantidad: 1,
      exportacion: true,
      datos: datosFacturaExportacion,
    })
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
  if (action === DESCARGAR_FACTURACION_ANUAL) {
    await facturacionOnlineAFIP()
  }

  if (action === EXCEL) {
    const excelProcessor = new ExcelProcessor()
    resultados = await excelProcessor.ejecutar(generar)
  }

  if (action === INSERTAR_USUARIO) {
    const questions = []
    questions.push({
      type: 'input',
      name: 'user',
      message: 'Inserte nombre de Usuario:',
    })
    questions.push({
      type: 'input',
      name: 'cuit',
      message: 'Ingrese CUIT:',
    })
    const resultado = await inquirer.prompt(questions)

    await writeToFile(resultado)
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

const facturacionOnlineAFIP = async () => {
  await listarOnline()
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
