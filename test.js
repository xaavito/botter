const {
  randomDetalle,
  randomValor,
  saveToCSV,
  dateFormatted,
} = require('./helper.js')

async function main() {
  //console.log(randomDetalle())
  //console.log(randomValor())
  saveToCSV(dateFormatted(), randomDetalle(), randomValor())
}

main()
