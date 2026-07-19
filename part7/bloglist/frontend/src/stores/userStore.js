import { create } from 'zustand'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'
const useUserStore = create((set) => ({
  user: null,

  setUser: (user) => {
    set({ user })

    if (user) {
      blogService.setToken(user.token)
      persistentUser.saveUser(user)
    }
  },

  initializeUser: () => {
    const user = persistentUser.getUser()

    if (user) {
      blogService.setToken(user.token)

      set({ user })
    }
  },

  logout: () => {
    persistentUser.removeUser()
    blogService.setToken(null)
    set({ user: null })
  },
}))

export default useUserStore
