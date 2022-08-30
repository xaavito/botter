const { randomDetalle, randomValor, saveToCSV } = require('./helper.js');

async function main() {
  console.log(randomDetalle());
  console.log(randomValor());
  saveToCSV('2020/06/01', 'Arreglo de pc','20000');
}

main();
