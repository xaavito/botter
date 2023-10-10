async function verTodos(page) {
  const navigationPromise = page.waitForNavigation({
    waitUntil: 'domcontentloaded',
  })

  await navigationPromise
  await page.click('text=Ver todos')
  await page.waitForTimeout(1000)
}

module.exports = {
  verTodos,
}
