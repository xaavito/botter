const { TIMEOUT } = require('../constants.js')

const cargarConcepto = async (page) => {
  await page.selectOption('select[name="idConcepto"]', '2')
  await page.waitForTimeout(TIMEOUT)
  //TODO
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarConcepto,
}
