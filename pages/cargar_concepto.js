const { TIMEOUT_FILL } = require('../helpers/constants.js')

const cargarConcepto = async (page) => {
  await page.selectOption('select[name="idConcepto"]', '2')
  await page.waitForTimeout(TIMEOUT_FILL)
  //TODO
  await page.click('input[value="Continuar >"]')
}

module.exports = {
  cargarConcepto,
}
