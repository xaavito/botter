const { listar } = require('../listar')

const facturacionAnual = async () => {
  await listar('anual')
}

module.exports = { facturacionAnual }
