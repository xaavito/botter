const { esperarCargaPagina } = require('../helpers/waitHelpers.js')

const cargarConcepto = async (page) => {
  await page.selectOption('select[name="idConcepto"]', '2')
  await esperarCargaPagina(page)
  //TODO
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarConcepto,
}
