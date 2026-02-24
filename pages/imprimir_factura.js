const { getInvoiceFile } = require('../helpers/helper.js')

const imprimirFactura = async (page, datos = null) => {
  // Imprimir factura
  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent('download'),
    // Perform the action that initiates download
    page.click('input[value="Imprimir..."]'),
  ])

<<<<<<< HEAD
  await download.saveAs(getInvoiceFile())
=======
  const path = !datos
    ? `./downloads/factura-${
        process.env.USER_CUIL
      }-${dateAsString()}-${uuid.v1()}.pdf`
    : `./data/downloads/factura-${
        datos.cuitEmisor
      }-${dateAsString()}-${uuid.v1()}.pdf`

  await download.saveAs(path)
>>>>>>> excel
}

module.exports = {
  imprimirFactura,
}
