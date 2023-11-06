// AlertContext.js

import { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext()

export const useNotificationCount = () => {
  return useContext(NotificationContext)
}

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(null)

  useEffect(() => {
    async function obtainNotificationCount () {
      try {
        const response = await fetch('/api/get-notification-count')
        const result = await response.json()
        setNotificationCount(result)
      } catch (error) {
        console.error(error)
      }
    }
    if (notificationCount === null) {
      obtainNotificationCount()
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notificationCount, setNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  )
}
