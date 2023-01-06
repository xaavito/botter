#!/usr/bin/env node.

const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
const MANUAL = 'MANUAL CON WIZARD'
const AUTOMATIC = 'AUTOMATICA CON .ENV CONFIGURATION'
SERVICE_CONCEPT ='SERVICIOS'
PRODUCT_CONCEPTO = 'PRODUCTOS'
BOTH_CONCEPTS = 'AMBOS'
WITH_CUIT  ='CON CUIT/CUIL'
NOT_NOMINATED ='NO NOMINADA'

const userDataQuestions = [{
    type: 'input',
    name: 'userName',
    message: 'Ingrese su usuario como se ve en la pagina de afip',
  },
  {
      type: 'input',
      name: 'userTaxID',
      message: 'Ingrese su cuit'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Ingrese su password',
  },
  {
  type: 'input',
  name: 'sales_point',
  message: 'Punto de venta Nro:',
},
{
  id:'concepts',
  type: 'list',
  name: 'concepts',
  message: 'Concepto a incluir ',
  choices: [SERVICE_CONCEPT, PRODUCT_CONCEPTO,BOTH_CONCEPTS],
}]

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync('FACTURA C', {
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  )
}

Date.prototype.addDaysToDate = function (days) {
  const date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}  

const generateFactura = async (userData) => {
    const playwright = require('playwright')
    const {
      login,
      randomDetalle,
      randomValor,
      dateAsString,
      dateFormatted,
      saveToCSV,
    } = require('./helper.js')
  
    const pointSalesNr = userData.sales_point || process.env.N_PUNTO_VENTA
    const userName = userData.userName || process.env.USER_NAME
    var month = userData.month || null

    const valor = userData.amount || process.env.AMOUNT
    const cantidad = '2'
    const clientTaxId = userData.clientTaxId
  
    // disable headless to see the browser's action
    const browser = await playwright.chromium.launch({
      headless: false,
      args: ['--disable-dev-shm-usage'],
    })
    const context = await browser.newContext({ acceptDownloads: true })
    const page = await context.newPage()
  
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'domcontentloaded',
    })
    await page.setDefaultNavigationTimeout(0)
  
    await login(page,userData)
  
    await navigationPromise
    await page.click('text=Ver todos')
    await page.waitForTimeout(1000)
    await page.click('text=Comprobantes en línea')
    await page.waitForTimeout(3000)
  
    let pages = await context.pages()
    const facturadorPage = pages[1]
  
    // Pagina
    await facturadorPage.click(`input[value="${userName}"]`)
  
    // Pagina
    await facturadorPage.click('text=Generar Comprobantes')
    await facturadorPage.waitForTimeout(1000)
    // Pagina
    await facturadorPage.selectOption(
      'select[name="puntoDeVenta"]', pointSalesNr
    )
  
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.click('input[value="Continuar >"]')
    await facturadorPage.waitForTimeout(1000)
    // Pagina
    await facturadorPage.selectOption('select[name="idConcepto"]', '2')
    await facturadorPage.waitForTimeout(2000)

    if(month!= null){
      month = month -1;
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), parseInt(month), 1);
      var lastDay = new Date(date.getFullYear(),  parseInt(month) + 1, 0);
      userData.firstDate = firstDay.toLocaleDateString('en-GB');
      userData.lastDate = lastDay.toLocaleDateString('en-GB');
      userData.payDate =  lastDay.addDaysToDate(10).toLocaleDateString('en-GB');
      await facturadorPage.fill('input[name="periodoFacturadoDesde"]', userData.firstDate)
      await facturadorPage.fill('input[name="periodoFacturadoHasta"]', userData.lastDate)
      await facturadorPage.fill('input[name="vencimientoPago"]',userData.payDate)
      await facturadorPage.waitForTimeout(1000)
    }
  
    await facturadorPage.click('input[value="Continuar >"]')
    await facturadorPage.waitForTimeout(1000)
  
    // // Pagina
    await facturadorPage.selectOption('select[name="idIVAReceptor"]', '1')
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.click('input[name="formaDePago"]')
    await facturadorPage.fill('input[name="nroDocReceptor"]', clientTaxId)
    await facturadorPage.waitForTimeout(5000)
    await facturadorPage.click("label[for='formadepago1']");
  
    await facturadorPage.click('input[name="formaDePago"]')
    await facturadorPage.click('input[value="Continuar >"]')
    await facturadorPage.waitForTimeout(1000)
  
    //TODO: parse data from wizard
    // // Pagina
    await facturadorPage.fill('input[name="detalleCodigoArticulo"]', '001')
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.fill('textarea[name="detalleDescripcion"]', 'detalle')
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.fill('input[name="detalleCantidad"]', cantidad)
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.fill('input[name="detallePrecio"]', valor)
    await facturadorPage.waitForTimeout(1000)
    await facturadorPage.click('input[value="Continuar >"]')
    await facturadorPage.waitForTimeout(1000)
  
    //confirmacion
  //   await facturadorPage.evaluate(
  //     () =>
  //       // eslint-disable-next-line no-undef
  //       (window.confirm = function () {
  //         return true
  //       })
  //   )
  
  //    await facturadorPage.click('input[value="Confirmar Datos..."]')
  
  //   await facturadorPage.waitForTimeout(1000)
  
  //   // Imprimir factura
  //   const [download] = await Promise.all([
  //     // Start waiting for the download
  //     facturadorPage.waitForEvent('download'),
  //     // Perform the action that initiates download
  //     facturadorPage.click('input[value="Imprimir..."]'),
  //   ])
  
  //   await download.saveAs(
  //     `./downloads/factura-${
  //       process.env.USER_CUIL
  //     }-${dateAsString()}-${uuid.v1()}.pdf`
  //   )
  
  //   saveToCSV(dateFormatted(), detalle, valor)
  
  //   await facturadorPage.waitForTimeout(1000)
  
  //  await browser.close()
  
  
}
const run = async () => {
  // show script introduction
  // ask questions
  var result = await inquirer.prompt(    {
    id:'mode_choice',
    type: 'list',
    name: 'selection',
    message: 'GENERAR FACTURA "C"  :',
    choices: [MANUAL, AUTOMATIC],
  },)

  if(result.selection == AUTOMATIC){
    console.log(result.selection)
  }
  if(result.selection == MANUAL){
    var userData = await inquirer.prompt(userDataQuestions)

    if(userData.concepts != null && userData.concepts != BOTH_CONCEPTS){
      var monthData = await inquirer.prompt({
        id:'month',
        type: 'list',
        name: 'month',
        message: 'Elija el mes a facturar, usaremos el primer y ultimo dia de cada mes como fechas de facturacion de servicios" ',
        choices: ['1-ENERO','2-FEBRERO','3-MARZO','4-ARBIL','5-MAYO','6-JUNIO','7-AGOSTO'],
      },)
      userData.month = monthData.month.split('-')[0];
      console.log(userData.month)
    }
    var clientTypeData =  await inquirer.prompt({
            type: 'list',
            name: 'client_info_type',
            message: 'Elija tipo de cliente"  :',
            choices: [WITH_CUIT ,NOT_NOMINATED] },)

      userData.clientInvoiceType = clientTypeData.client_info_type
      
        if(clientTypeData.client_info_type == WITH_CUIT){
         var client_taxId = await inquirer.prompt({
            type: 'input',
            name: 'cuit_cul',
            message: 'Ingrese cuit/cuil a facturar',
          })
         userData.clientTaxId = client_taxId.cuit_cul

      }
      generateFactura(userData)
      
  }
}

init();
run();


