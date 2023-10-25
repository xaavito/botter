async function verTodos(page) {
  await page.click('text=Ver todos')
  await page.waitForTimeout(1000)
}

module.exports = {
  verTodos,
}
