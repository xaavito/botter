const { listar } = require('../actions/listar')

const facturacionAnualAnterior = async () => {
  await listar('anualAnterior')
}

module.exports = { facturacionAnualAnterior }
