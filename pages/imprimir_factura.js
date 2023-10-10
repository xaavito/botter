const uuid = require('uuid')
const { dateAsString } = require('../helper.js')

async function cargarConcepto(page) {
  // Imprimir factura
  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent('download'),
    // Perform the action that initiates download
    page.click('input[value="Imprimir..."]'),
  ])

  await download.saveAs(
    `../downloads/factura-${
      process.env.USER_CUIL
    }-${dateAsString()}-${uuid.v1()}.pdf`
  )
}

module.exports = {
  cargarConcepto,
}
