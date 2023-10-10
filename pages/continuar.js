async function continuar(page) {
  await page.click('input[value="Continuar >"]')
  await page.waitForTimeout(1000)
}

module.exports = {
  continuar,
}
