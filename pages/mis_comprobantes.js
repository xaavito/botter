async function misComprobantes(page) {
  await page.click('text=MIS COMPROBANTES')
  await page.waitForTimeout(1000)
}

module.exports = {
  misComprobantes,
}
