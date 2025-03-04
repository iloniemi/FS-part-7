import { createContext, useContext, useReducer } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.payload
  case 'RESET_NOTIFICATION':
    return undefined
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(reducer, undefined)
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationText = () => {
  const textAndDispatch = useContext(NotificationContext)
  return textAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const textAndDispatch = useContext(NotificationContext)
  return textAndDispatch[1]
}

export const setNotification = (dispatchToUse, text, seconds = 5) => {
  dispatchToUse({
    type: 'SET_NOTIFICATION',
    payload: text
  })
  setTimeout(() => {
    dispatchToUse({ type: 'RESET_NOTIFICATION' })
  }, seconds*1000)
}

export default NotificationContext
