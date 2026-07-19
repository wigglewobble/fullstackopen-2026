import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  message: null,

  setMessage: (message) => {
    set({ message })

    if (message) {
      setTimeout(() => {
        set({ message: null })
      }, 5000)
    }
  }
}))

export default useNotificationStore