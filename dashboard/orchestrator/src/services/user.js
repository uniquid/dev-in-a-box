export const logout =  () => {
  [
    'ip',
    'name',
    'session'
  ].forEach(name => sessionStorage.removeItem(name))
  window.location.reload()
}
