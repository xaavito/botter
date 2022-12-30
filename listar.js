const csv = require('csv-parser')
const fs = require('fs')

const csvFilename = `${process.env.USER_CUIL}.csv`

const listar = async (toList) => {
  let invoices = []
  fs.createReadStream(csvFilename)
    .pipe(csv())
    .on('data', (row) => {
      invoices.push(row)
      if (!toList) {
        console.log(row);
      }
    })
    .on('end', () => {
      //console.log('CSV file successfully processed')
      console.log('array ', invoices)
      if (toList) {
        return invoices;
      }
    })
}

module.exports = { listar }
