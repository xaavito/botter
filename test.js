const {
  //randomDetalle,
  //randomValor,
  //saveToCSV,
  //dateFormatted,
  //getDatesfromOneYearBackv2,
  dateAsString,
  oneYearBefore,
  stringDateToActualDate
} = require('./helper.js')

async function main() {
  //console.log(randomDetalle())
  //console.log(randomValor())
  //saveToCSV(dateFormatted(), randomDetalle(), randomValor());
  console.log(dateAsString());
  console.log(dateAsString(oneYearBefore()));
  console.log(stringDateToActualDate(dateAsString(oneYearBefore())));
  
}

main()
