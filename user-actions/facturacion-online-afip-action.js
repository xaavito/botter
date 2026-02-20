const { listarOnline } = require('../actions/listarOnline')

const facturacionOnlineAFIP = async () => {
  await listarOnline()
}

module.exports = { facturacionOnlineAFIP }
