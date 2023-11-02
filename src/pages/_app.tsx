import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '~/styles/globals.css'
import { Providers } from '~/providers'
import { CustomModalProvider } from '~/context/ModalContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <Providers>
      <SessionProvider session={session}>
        <CustomModalProvider>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Roboto&display=swap" rel="stylesheet"></link>
          <Component {...pageProps} />
          <ToastContainer />
        </CustomModalProvider>
      </SessionProvider>
    </Providers>
  )
}

export default MyApp
