const { generar } = require('../generar')
const { facturacionMensual } = require('./facturacion-mensual-action')

const generarAction = async () => {
  const resultados = await generar({ cantidad: 1 })
  // corremos ademas que nos muestre cuanto viene facturando mes a mes
  await facturacionMensual()
  return resultados
}

module.exports = { generarAction }
