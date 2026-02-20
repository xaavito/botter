const { listarOnline } = require('../listarOnline')

const facturacionOnlineAFIP = async () => {
  await listarOnline()
}

module.exports = { facturacionOnlineAFIP }
