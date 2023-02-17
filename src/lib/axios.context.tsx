import axios, { AxiosInstance } from 'axios'
import { plainToInstance } from 'class-transformer'
import qs from 'qs'
import React, { createContext, useRef } from 'react'

import { UserDetails } from '../types/schemas/abc'
import useTokenRefresh from './tokenRefresh.service'
import { useUser } from './user.context'
import { getCookie } from './utilities.service'

export const CSRF_ACCESS_COOKIE = 'csrf_access_token'

export const AxiosContext = createContext<AxiosInstance>(axios)

/**
 * Code for the axios instance provider and the accompanying useAxios hook was sourced (and modified) from the following
 * blog post by Arek Nawo:
 * https://blog.openreplay.com/integrating-axios-with-react-hooks
 *
 * NOTE: Currently, the context only supports one instance for the Materials API. The functionality would have to be
 * modified to support the eMarking and ABC APIs in the future
 *
 * Request and response interceptors:
 * 1. The request interceptor is used to attach the authorization header if the user's logged in
 * 2. The response interceptor should catch a 401, refresh the tokens and retry the original request
 *
 *
 */

export const AxiosInstanceProvider = ({
  config = {},
  children,
}: {
  config: any
  children: React.ReactNode
}) => {
  const instanceRef = useRef<AxiosInstance | null>(null)
  const { storeUserDetails } = useUser()
  const { refreshAccessToken } = useTokenRefresh()

  /* NOTE: See https://beta.reactjs.org/apis/useref#avoiding-recreating-the-ref-contents */
  if (instanceRef.current === null) {
    /* Setup instance and interceptors */
    let axiosInstance = axios.create(config)
    axiosInstance.interceptors.request.use((request) => {
      /* TODO: Need to check if the user's logged in before adding the token */
      request.headers = { 'X-CSRF-TOKEN': getCookie(CSRF_ACCESS_COOKIE) }
      request.withCredentials = true
      request.paramsSerializer = (params) => qs.stringify(params, { indices: false })

      return request
    })
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (
          (error.response.status === 401 ||
            (error.response.status === 422 &&
              error.response.data?.detail === 'Signature has expired')) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          await refreshAccessToken().then((response: any) => {
            storeUserDetails(plainToInstance(UserDetails, response.data))
          })
          return axiosInstance(originalRequest)
        }
        return Promise.reject(error)
      }
    )
    instanceRef.current = axiosInstance
  }

  /* NOTE: I think the interceptors would be added on each refresh? But does the reference last? */
  return <AxiosContext.Provider value={instanceRef.current}>{children}</AxiosContext.Provider>
}
