const { listar } = require('../actions/listar')

const facturacionMensual = async () => {
  await listar('mensual')
}

module.exports = { facturacionMensual }
