const { randomDetalle, randomValor, saveToCSV, dateFormatted } = require('./helper.js');

async function main() {
  console.log(randomDetalle());
  console.log(randomValor());
  saveToCSV(dateFormatted(), 'Arreglo de pc','20000');
}

main();
