const { listar } = require('../listar')

const facturacionMensual = async () => {
  await listar('mensual')
}

module.exports = { facturacionMensual }
