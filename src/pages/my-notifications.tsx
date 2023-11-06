import React, { useState, useEffect } from 'react'
import NavBar from '~/components/NavBar'
import { useSession, getSession } from 'next-auth/react'
import { Button, Divider, Link } from '@nextui-org/react'
import { prisma } from '../server/db'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue, Avatar, AvatarGroup } from "@nextui-org/react"
import { useCallback } from 'react'
import { useCustomModal } from '~/context/ModalContext'
import { useDisclosure } from '@nextui-org/react'
import dynamic from 'next/dynamic'
import { parseDateString } from '~/utils/dateUtils'
import { useNotificationCount } from '~/context/NotificationContext'

const CustomModal = dynamic(() => import('../components/CustomModal'), { ssr: false })
// Only needs product + available properties
const MyNotifications = ({ notificationsData }) => {
  const { data: session } = useSession()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [notifications, setNotifications] = useState(notificationsData)
  const { notificationCount, setNotificationCount } = useNotificationCount()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { openModal } = useCustomModal()

  const handleOpenModal = (type, section, data) => {
    openModal(type, section, data)
    onOpen()
  }

  const handleMarkAsRead = async (notificationId) => {
    // Frontend
    const newNotifications = notifications.map(notification => {
      if (notificationId === notification.record_id) {
        notification.is_read = notification.is_read === '1' ? '0' : '1'
        return notification
      }
      return notification
    })
    setNotifications(newNotifications)

    // Backend
    const notificationToUpdate = newNotifications.filter(notification => notificationId === notification.record_id)[0]
    const JSONData = JSON.stringify({ id: notificationToUpdate.record_id, isRead: notificationToUpdate.is_read })

    try {
      const options = {
        // The method is POST because we are sending data.
        method: 'PUT',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json'
        },
        // Body of the request is the JSON data we created above.
        body: JSONData
      }
      const response = await fetch('/api/edit-notification', options)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveNotification = async (notificationId) => {
    // Changes in frontEnd
    const newNotifications = notifications.filter(notification => notificationId !== notification.record_id)
    setNotifications(newNotifications)

    // Changes on backEnd
    try {
      const answer = window.confirm(`${notificationId} is going to be deleted. Are you sure?`)
      if (answer) {
        const response = await fetch(`/api/delete-notification?id=${notificationId}`, { method: 'DELETE' })
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main>
      <div className='p-6 mx-8 mt-10 bg-slate-50  rounded-md'>
        <ul>
          {isClient && notifications.map((notification) => (
            <li key={notification.id} className={`${notification.is_read === '1' ? 'bg-slate-200' : 'bg-slate-50'} rounded-md p-2`}>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                  <h2>{notification.title}</h2>
                  <p className='text-gray-600 text-tiny'>{notification.description}</p>
                  <p className=' text-gray-600 text-tiny'>{parseDateString(notification.date_created)}</p>
                </div>
                <div className='flex items-center'>
                  <Tooltip content='Mark as read' >
                    <button className='outline-none'>
                      <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
                        {notification.is_read === '1'
                          ? (
                            <button onClick={() => handleMarkAsRead(notification.record_id)}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                              </svg>
                            </button>
                          )
                          : (
                            <button onClick={() => handleMarkAsRead(notification.record_id)} >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </button>
                          )}
                      </span>
                    </button>
                  </Tooltip>
                  <Tooltip color='danger' content='Remove Notification'>
                    <button className='outline-none' onClick={() => handleRemoveNotification(notification.record_id)}>
                      <span className='text-lg text-danger cursor-pointer active:opacity-50'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {
        isOpen && (
          <CustomModal
            onOpenChange={onOpenChange}
            isOpen={isOpen}
            session={session}
            size='4xl'
            scrollBehavior='inside'
          />
        )
      }
    </main >
  )
}

export const getServerSideProps = async (context: any) => {
  const session = await getSession({ req: context.req })

  if (!session || session?.access_to_marketplace !== true) { // Typescript eslint warning
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const notifications = await prisma.notification.findMany({
    where: {
      user_id: session?.user?.id
    }
  })

  const notificationsData = JSON.parse(JSON.stringify(notifications))

  return {
    props: { notificationsData }
  }
}

export default MyNotifications
