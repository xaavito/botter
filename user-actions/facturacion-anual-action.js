const { listar } = require('../actions/listar')

const facturacionAnual = async () => {
  await listar('anual')
}

module.exports = { facturacionAnual }
