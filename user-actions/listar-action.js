const { listar } = require('../listar')

const listarAction = async () => {
  await listar()
}

module.exports = { listarAction }
