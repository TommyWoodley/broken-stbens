import { Navigate, Outlet, useLocation } from 'react-router-dom'

import useAuth from '../lib/auth.service'
import { Navigation } from './Navigation'

/**
 * A protected route checks if a user is logged in before allowing a route to succeed. If not, they're
 * redirected to page at the redirect path (login by default).
 *
 * TODO: Wrap header and possibly footer components around the outlet. Else create a separate layout component that
 * would add the header and footer with an option to disable it for certain pages.
 */
export const AuthProtectedRoute = ({ redirectPath = '/' }) => {
  const { isLoggedIn } = useAuth()
  const { pathname, search } = useLocation()

  return isLoggedIn ? (
    <>
      <Navigation />
      <Outlet />
      {/* TODO: Create a footer component */}
    </>
  ) : (
    <Navigate to={redirectPath} state={{ next: `${pathname}${search}` }} />
  )
}
