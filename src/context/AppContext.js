import React, { createContext, useContext, useReducer } from 'react'

const initialState = {
  currentPage: 'feed',
  isNotificationOpen: true,
  user: null,
  loading: false,
  error: null,
}

export const ACTIONS = {
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload }
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload, loading: false }
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    case ACTIONS.HIDE_NOTIFICATION:
      return { ...state, isNotificationOpen: false }
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    default:
      return state
  }
}

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = {
    ...state,
    dispatch,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

