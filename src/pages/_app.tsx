import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '~/styles/globals.css'
import { Providers } from '~/providers'
import { CustomModalProvider } from '~/context/ModalContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { NotificationProvider } from '~/context/NotificationContext'
import NavBar from '~/components/NavBar'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
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
