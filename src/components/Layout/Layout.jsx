import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function Layout() {
  const mainRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main ref={mainRef} className="h-full min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
