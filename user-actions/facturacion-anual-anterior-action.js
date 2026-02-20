const { listar } = require('../listar')

const facturacionAnualAnterior = async () => {
  await listar('anualAnterior')
}

module.exports = { facturacionAnualAnterior }
