const storageKey = 'loggedBlogappUser'

const getUser = () => {
  const user = window.localStorage.getItem(storageKey)

  return user ? JSON.parse(user) : null
}

const saveUser = (user) => {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify(user)
  )
}

const removeUser = () => {
  window.localStorage.removeItem(storageKey)
}

export default {
  getUser,
  saveUser,
  removeUser,
}