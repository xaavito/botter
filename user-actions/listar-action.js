const { listar } = require('../actions/listar')

const listarAction = async () => {
  await listar()
}

module.exports = { listarAction }
