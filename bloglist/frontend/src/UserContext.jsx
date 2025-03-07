import { createContext, useContext, useReducer } from 'react'


const reducer = (state, action) => {
  switch (action.type) {
  case 'SET_USER':
    console.log('setting user', action.payload)
    return action.payload
  case 'RESET_USER':
    return undefined
  default:
    return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(reducer, undefined)
  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}


export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}

export const userActions = {
  reset: () => ({ type: 'RESET_USER' }),
  setUser: (user) => ({ type: 'SET_USER', payload: user })
}

export default UserContext