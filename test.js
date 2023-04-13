const {
  randomDetalle,
  randomValor,
  saveToCSV,
  dateFormatted,
  getDatesfromOneYearBackv2
} = require('./helper.js')

async function main() {
  //console.log(randomDetalle())
  //console.log(randomValor())
  //saveToCSV(dateFormatted(), randomDetalle(), randomValor());
  console.log(getDatesfromOneYearBackv2());
}

main()
