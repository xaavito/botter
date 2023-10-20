async function emitidos(page) {
  await page.click('text=Emitidos')
  await page.waitForTimeout(1000)
}

module.exports = {
  emitidos,
}
