async function miPagina(page) {
  await page.click(`input[value="${process.env.USER_NAME}"]`)
}

module.exports = {
  miPagina,
}
