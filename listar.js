const csv = require('csv-parser')
const fs = require('fs')

const csvFilename = `${process.env.USER_CUIL}.csv`

const listar = () => {
  fs.createReadStream(csvFilename)
    .pipe(csv())
    .on('data', (row) => {
      console.log(row)
    })
    .on('end', () => {
      console.log('CSV file successfully processed')
    })
}

module.exports = { listar }
