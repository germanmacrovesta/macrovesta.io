// AlertContext.js

import { useSession } from 'next-auth/react'
import { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext()

export const useNotificationCount = () => {
  return useContext(NotificationContext)
}

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(null)
  const { data: session } = useSession()
  console.log(session)
  // TODO Not recalculate each page changes - Zustand/UseMemo...
  useEffect(() => {
    async function obtainNotificationCount () {
      if (session?.user.id) {
        try {
          const response = await fetch(`/api/get-notification-count?id=${session.user.id}`)
          console.log(response)
          const result = await response.json()
          setNotificationCount(result)
        } catch (error) {
          console.error(error)
        }
      }
    }
    if (notificationCount === null) {
      obtainNotificationCount()
    }
  }, [session])

  return (
    <NotificationContext.Provider value={{ notificationCount, setNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  )
}
