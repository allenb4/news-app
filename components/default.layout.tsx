import React, { ReactNode } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'

type Props = {
  children?: ReactNode;
}

function DefaultLayout({ children }: Props) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-slate-100 text-neutral-900">
      <div className="flex-auto overflow-hidden">
        <header
          className="w-full py-4 px-4 md:px-20 border-b border-slate-300/50"
        >
          <div className="flex md:flex-row items-center justify-between mx-auto max-w-7xl">
            <h1 className="text-slate-700 font-weight-500 text-xl">News Aggregator</h1>
            {session ?
              (
                <div className="hidden md:flex flex-row items-center space-x-3">
                  <h4 className="font-weight-500 text-lg">Hello <b>{session.user?.name}</b></h4>
                  <button
                    className="rounded px-5 py-1 shadow-sm bg-transparent border-solid border border-slate-700 text-slate-700"
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                </div>
              ) :
              (
                <button
                  className="rounded px-5 py-1 shadow-sm bg-transparent border-solid border border-slate-700 text-slate-700"
                  onClick={() => signIn()}
                >
                  Login
                </button>
              )
            }

          </div>
        </header>
        {session ? (
        <main className="w-full py-4 px-4 md:px-20 h-full bg-gray-200">
          <div className="flex md:flex-row justify-between mx-auto max-w-7xl">
            {children}
          </div>
        </main>)
        : '' }

      </div>
    </div>
  );
}

export default DefaultLayout;
