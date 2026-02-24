const { getInvoiceFile } = require('../helpers/helper.js')

const imprimirFactura = async (page, datos = null) => {
  // Imprimir factura
  const [download] = await Promise.all([
    // Start waiting for the download
    page.waitForEvent('download'),
    // Perform the action that initiates download
    page.click('input[value="Imprimir..."]'),
  ])

  await download.saveAs(getInvoiceFile())
}

module.exports = {
  imprimirFactura,
}
