/**
 * Autentica en la pagina del afip completando user and password
 * Usa las credenciales de .env
 * @param page {Page}
 * @returns {Promise<void>}
 */
async function login(page, datos = null) {
  const user = !datos ? process.env.USER_CUIL : datos.cuitEmisor;
  const pass = !datos ? process.env.USER_PASS : datos.password;
  await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml')
  await page.waitForSelector('input[name="F1:username"]')
  await page.fill('input[name="F1:username"]', user)
  await page.click('input[name="F1:btnSiguiente"]')
  await page.waitForSelector('input[name="F1:password"]', { visible: true })
  await page.fill('input[name="F1:password"]', pass)
  await page.click('input[name="F1:btnIngresar"]')
}

module.exports = {
  login,
}
