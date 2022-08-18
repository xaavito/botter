const rounder = (num) => ('0' + num).slice(-2);

let detallesArr = JSON.parse(process.env.DETALLES);
let valoresArr = JSON.parse(process.env.USER_MONTO);

const randomDetalle = () => {
    var random = Math.floor(Math.random() * detallesArr.length);
    return detallesArr[random] || 'Servicios'
};

const randomValor = () => {
    var random = Math.floor(Math.random() * valoresArr.length);
    return valoresArr[random]
};

/**
 * Autentica en la pagina del afip completando user and password
 * Usa las credenciales de .env
 * @param page {Page}
 * @returns {Promise<void>}
 */
async function login(page) {
    await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml');
    await page.waitForSelector('input[name="F1:username"]');
    await page.fill('input[name="F1:username"]', process.env.USER_CUIL);
    await page.click('input[name="F1:btnSiguiente"]');
    await page.waitForSelector('input[name="F1:password"]', { visible: true });
    await page.fill('input[name="F1:password"]', process.env.USER_PASS);
    await page.click('input[name="F1:btnIngresar"]');
}

module.exports = {
    rounder,
    login,
    randomDetalle,
    randomValor
}