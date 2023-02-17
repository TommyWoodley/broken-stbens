import axios from 'axios'
import { plainToInstance } from 'class-transformer'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { UserDetails } from '../types/schemas/abc'
import { CSRF_ACCESS_COOKIE } from './axios.context'
import { useToast } from './toast.context'
import { useUser } from './user.context'
import { errorMessage, getCookie } from './utilities.service'

/**
 * TODO: The plan is to process authentication- and authorisation-related queries here and update the user context based
 * on the response. This place deals with the JWT and its storage management (cookies).
 *
 * NOTE: It'd be a good idea to section this off into a services folder and possibly move the providers into a hooks
 * folder? Though, we'd have to reason out what actually goes inside lib.
 */

type Credentials = {
  username: string
  password: string
}

export default function useAuth() {
  const { addToast } = useToast()
  const { userDetails, storeUserDetails, clearUserDetails } = useUser()
  const [isLoggedIn, setIsLoggedIn] = useState(userDetails !== undefined)
  const navigate = useNavigate()

  const loginUser = async (data: Credentials) => {
    return axios({
      url: endpoints.login,
      method: 'post',
      data: data,
    })
      .then((response) => {
        storeUserDetails(plainToInstance(UserDetails, response.data))
      })
      .catch((error) => {
        const msg =
          error.response.status === 500
            ? 'The server encountered an error while fetching your details. Contact DoC EdTech.'
            : errorMessage(error) || 'Login failed.'
        addToast({ variant: 'error', title: msg })
      })
  }

  useEffect(() => setIsLoggedIn(userDetails !== undefined), [userDetails])

  const logoutUser = () => {
    axios({
      url: endpoints.logout,
      method: 'delete',
      headers: { 'X-CSRF-TOKEN': getCookie(CSRF_ACCESS_COOKIE) },
    })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        clearUserDetails()
        navigate('/')
      })
  }

  return { loginUser, logoutUser, isLoggedIn }
}
