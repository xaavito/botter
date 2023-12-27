async function menuPrincipal(page) {
  await page.click('input[value="Menú Principal"]')
  await page.waitForTimeout(1000)
}

module.exports = {
  menuPrincipal,
}
