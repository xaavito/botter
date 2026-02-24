const { excel } = require('../actions/excel.js')

const excelAction = async () => {
  await excel()
}

module.exports = { excelAction }
