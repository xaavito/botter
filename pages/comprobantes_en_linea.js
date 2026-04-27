const { esperarCargaPagina } = require('../helpers/waitHelpers.js')
const logger = require('../helpers/logger.js')

async function comprobantesEnLinea(page) {
  // Verificar si el elemento "Comprobantes en línea" existe
  const comprobantesLink = await page.$('text=Comprobantes en línea')
  
  if (!comprobantesLink) {
    const errorMsg = 
      'El usuario no tiene acceso a "Comprobantes en línea". ' +
      'No es posible generar facturas. Por favor, verifique que el usuario ' +
      'tenga los permisos necesarios en AFIP.'
    
    logger.error(errorMsg)
    const error = new Error(errorMsg)
    error.noReintentar = true // Marcar para no reintentar este tipo de error
    throw error
  }
  
  await page.click('text=Comprobantes en línea')
  await esperarCargaPagina(page)
}

module.exports = {
  comprobantesEnLinea,
}
