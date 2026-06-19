import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    ''
  )

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const value = useContext(NotificationContext)
  return value[0]
}

export const useNotificationDispatch = () => {
  const value = useContext(NotificationContext)
  return value[1]
}

export const useNotify = () => {
  const dispatch = useNotificationDispatch()

  return (message) => {
    dispatch({
      type: 'SET',
      payload: message
    })

    setTimeout(() => {
      dispatch({
        type: 'CLEAR'
      })
    }, 5000)
  }
}