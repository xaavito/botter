#!/usr/bin/env node.

const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
//const shell = require('shelljs')

const GENERAR = 'generate factura random'
const LISTAR = 'listar facturas realizadas a la fecha'

const { generar } = require('./generar');
const { listar } = require('./listar');

const init = () => {
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
      choices: [GENERAR, LISTAR],
    },
  ]
  return inquirer.prompt(questions)
}

const callToAction = async (action) => {
  if (action === GENERAR) {
    await generar();
  }
  if (action === LISTAR) {
    await listar();
  }
  return action
}

const success = (result) => {
  console.log(
    chalk.white.bgGreen.bold(`Listo! accion finalizada!!!! ${result}`)
  )
}

const run = async () => {
  // show script introduction
  init()
  // ask questions
  const { selection } = await askQuestions()
  // do stuff with input
  // maybe we should primisfy all and return actual status
  const result = await callToAction(selection)
  // show success message
  success(selection)
}

run();
