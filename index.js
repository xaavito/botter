#!/usr/bin/env node.

// NRO PUNTO VENTA - NUMBER OPTION
//  SERVIVIOS , PRODUCTOS Y SERVICIOS // EMUM
const inquirer = require('inquirer')
const chalk = require('chalk')
const figlet = require('figlet')
//const shell = require('shelljs')

const MANUAL = 'MANUAL CON WIZARD'
const AUTOMATIC = 'AUTOMATICA CON .ENV CONFIGURATION'
SERVICE_CONCEPT ='SERVICIOS'
PRODUCT_CONCEPTO = 'PRODUCTOS'
BOTH_CONCEPTS = 'AMBOS'
WITH_CUIT  ='CON CUIT/CUIL'
NOT_NOMINATED ='NO NOMINADA'
const CLIENT_TAX_ID = 'INGRESE CUIT A FACTURAR'
const INITIAL_DATE = 'INGRESE INICIO PERIODO FACTURADO'
const FINAL_DATE = 'INGRESE INICIO PERIODO FACTURADO'
const EXPIRES_DATE =  'FECHA DE VENCIMIENTO PARA SU FACTURA'
 var INVOICE_DATA = {

 };


// const { generar } = require('./generar');
// const { listar } = require('./listar');
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

const run = async () => {
  // show script introduction
  init()
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
        choices: ['ENERO','FEBRERO','MARZO','ARBIL','MAYO','JUNIO','AGOSTO'],
      },)
      userData.month = monthData.month
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
      console.log(userData)
  }

}
 run()



// FZ3NMA CODE
// const playwright = require('playwright')
// const inquirer = require('inquirer')
// const chalk = require('chalk')
// const figlet = require('figlet')
// const uuid = require('uuid')
// const {
//   login,
//   randomDetalle,
//   randomValor,
//   dateAsString,
//   dateFormatted,
//   saveToCSV,
// } = require('./helper.js')

// Date.prototype.addDaysToDate = function (days) {
//   const date = new Date(this.valueOf())
//   date.setDate(date.getDate() + days)
//   return date
// }

// const WIZARD = 'Generar factura con wizard'
// const MANUAL = 'Manual con .env'
// var detalle = 'Horas programacion'
// var valor = '2500,00'
// var cantidad = '68'


//  var EventEmitter = require('events');
// var prompt = new EventEmitter();
// var current = null;
// var result = {};
// process.stdin.resume();

// process.stdin.on('data', function(data){
//   prompt.emit(current, data.toString().trim());
// });

// prompt.on(':new', function(name, question){
//   current = name;
//   console.log(question);
//   process.stdout.write('> ');
// });

// prompt.on(':end', function(){
//   console.log('\n', result);
//   process.stdin.pause();
// });



// prompt.emit(':new', 'month', 'Ingrese mes:');

// prompt.on('month', function(data){
//   data = data -1;
//   var date = new Date();
//   var firstDay = new Date(date.getFullYear(), parseInt(data), 1);
//   var lastDay = new Date(date.getFullYear(),  parseInt(data) + 1, 0);
//   result.initDate = firstDay.toLocaleDateString('en-GB');
//   result.lastDate = lastDay.toLocaleDateString('en-GB');
//   result.payDate =  lastDay.addDaysToDate(10).toLocaleDateString('en-GB');
//    prompt.emit(':new', 'client_cuilt', 'Cuil a facturar:');
// });


// prompt.on('client_cuilt', function(data){
//   result.client_cuil = data
//   prompt.emit(':new', 'quantity', 'Cantidad');
// });

// prompt.on('quantity', function(data){
//   result.quantity = data
//   prompt.emit(':new', 'amount', 'Valor');
// });


// prompt.on('amount', function(data){
//   result.amount = data;
//   prompt.emit(':end');
//   main()
// });



// async function main() {
//   const detalle = 'Horas programacion'
//   const valor = result.amount
//   const cantidad = result.quantity
//   const client_cuil = result.client_cuil

//   // disable headless to see the browser's action
//   const browser = await playwright.chromium.launch({
//     headless: false,
//     args: ['--disable-dev-shm-usage'],
//   })
//   const context = await browser.newContext({ acceptDownloads: true })
//   const page = await context.newPage()

//   const navigationPromise = page.waitForNavigation({
//     waitUntil: 'domcontentloaded',
//   })
//   await page.setDefaultNavigationTimeout(0)

//   await login(page)

//   await navigationPromise
//   await page.click('text=Ver todos')
//   await page.waitForTimeout(1000)
//   await page.click('text=Comprobantes en línea')
//   await page.waitForTimeout(3000)

//   let pages = await context.pages()
//   const facturadorPage = pages[1]

//   // Pagina
//   await facturadorPage.click(`input[value="${process.env.USER_NAME}"]`)

//   // Pagina
//   await facturadorPage.click('text=Generar Comprobantes')
//   await facturadorPage.waitForTimeout(1000)
//   // Pagina
//   await facturadorPage.selectOption(
//     'select[name="puntoDeVenta"]',
//     process.env.N_PUNTO_VENTA || '2'
//   )

//   await facturadorPage.waitForTimeout(1000)
//   await facturadorPage.click('input[value="Continuar >"]')
//   await facturadorPage.waitForTimeout(1000)
//   // Pagina
//   await facturadorPage.selectOption('select[name="idConcepto"]', '2')
//   await facturadorPage.waitForTimeout(2000)
//   await facturadorPage.fill('input[name="periodoFacturadoDesde"]', result.initDate)
//   await facturadorPage.fill('input[name="periodoFacturadoHasta"]', result.lastDate)
//   await facturadorPage.fill('input[name="vencimientoPago"]',result.payDate)
//   await facturadorPage.waitForTimeout(1000)
//   await facturadorPage.click('input[value="Continuar >"]')
//   await facturadorPage.waitForTimeout(1000)

//   // // Pagina
//   await facturadorPage.selectOption('select[name="idIVAReceptor"]', '1')
//   await facturadorPage.waitForTimeout(1000)
//   await facturadorPage.click('input[name="formaDePago"]')
//   await facturadorPage.fill('input[name="nroDocReceptor"]', client_cuil)
//   await facturadorPage.waitForTimeout(5000)
//   await facturadorPage.click("label[for='formadepago1']");

//   await facturadorPage.click('input[name="formaDePago"]')
//   await facturadorPage.click('input[value="Continuar >"]')
//   await facturadorPage.waitForTimeout(1000)

//   // // Pagina
//   await facturadorPage.fill('input[name="detalleCodigoArticulo"]', '001')
//   await facturadorPage.waitForTimeout(1000)
//   await facturadorPage.fill('textarea[name="detalleDescripcion"]', detalle)
//   await facturadorPage.waitForTimeout(1000)
//   await facturadorPage.fill('input[name="detalleCantidad"]', cantidad)
//   await facturadorPage.waitForTimeout(1000)
//   await facturadorPage.fill('input[name="detallePrecio"]', valor)
//   await facturadorPage.waitForTimeout(1000)
//   await facturadorPage.click('input[value="Continuar >"]')
//   await facturadorPage.waitForTimeout(1000)

//   //confirmacion
// //   await facturadorPage.evaluate(
// //     () =>
// //       // eslint-disable-next-line no-undef
// //       (window.confirm = function () {
// //         return true
// //       })
// //   )

// //    await facturadorPage.click('input[value="Confirmar Datos..."]')

// //   await facturadorPage.waitForTimeout(1000)

// //   // Imprimir factura
// //   const [download] = await Promise.all([
// //     // Start waiting for the download
// //     facturadorPage.waitForEvent('download'),
// //     // Perform the action that initiates download
// //     facturadorPage.click('input[value="Imprimir..."]'),
// //   ])

// //   await download.saveAs(
// //     `./downloads/factura-${
// //       process.env.USER_CUIL
// //     }-${dateAsString()}-${uuid.v1()}.pdf`
// //   )

// //   saveToCSV(dateFormatted(), detalle, valor)

// //   await facturadorPage.waitForTimeout(1000)

// //  await browser.close()
// }
