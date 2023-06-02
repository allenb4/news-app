import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react'
import DefaultLayout from '@/components/default.layout'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </SessionProvider>
  )
}
