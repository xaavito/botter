const {
  //randomDetalle,
  //randomValor,
  //saveToCSV,
  //dateFormatted,
  //getDatesfromOneYearBackv2,
  dateAsString,
  oneYearBefore,
  stringDateToActualDate,
} = require('./helper.js')

const logger = require('./logger')

async function main() {
  //console.log(randomDetalle())
  //console.log(randomValor())
  //saveToCSV(dateFormatted(), randomDetalle(), randomValor());
  logger.info(dateAsString())
  logger.info(dateAsString(oneYearBefore()))
  logger.info(stringDateToActualDate(dateAsString(oneYearBefore())))
}

main()
