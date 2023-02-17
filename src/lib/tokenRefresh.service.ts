import axios from 'axios'
import { useCallback } from 'react'

import { endpoints } from '../constants/endpoints'
import useAuth from './auth.service'
import { getCookie } from './utilities.service'

export const CSRF_REFRESH_COOKIE = 'csrf_refresh_token'
function useTokenRefresh() {
  const { logoutUser } = useAuth()

  const refreshAccessToken = useCallback(() => {
    return axios({
      method: 'post',
      headers: { 'X-CSRF-TOKEN': getCookie(CSRF_REFRESH_COOKIE) },
      url: endpoints.refresh,
    }).catch((_) => {
      logoutUser()
    })
  }, [logoutUser])

  return { refreshAccessToken }
}

export default useTokenRefresh
