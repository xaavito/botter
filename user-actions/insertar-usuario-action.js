const inquirer = require('inquirer')
const { writeToFile } = require('../helpers/helper.js')

const insertarUsuarioAction = async () => {
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

module.exports = { insertarUsuarioAction }
