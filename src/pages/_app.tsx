import type { AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '~/styles/globals.css'
import { Providers } from '~/providers'
import { CustomModalProvider } from '~/context/ModalContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { NotificationProvider } from '~/context/NotificationContext'
import NavBar from '~/components/NavBar'
import { useEffect } from 'react'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.weglot.com/weglot.min.js'
    script.async = true

    script.onload = () => {
      Weglot.initialize({
        api_key: 'wg_60b49229f516dee77edb3109e6a46c379'
      })
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Providers>
      <SessionProvider session={session}>
        <CustomModalProvider>
          <NotificationProvider>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>
            <NavBar session={session}></NavBar>
            <Component {...pageProps} />
            <ToastContainer />
          </NotificationProvider>
        </CustomModalProvider>
      </SessionProvider>
    </Providers>
  )
}

export default MyApp
