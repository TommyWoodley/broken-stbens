import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { SHORT_YEAR_REGEX } from '../constants/global'
import { UserDetails } from '../types/schemas/abc'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { formatShortYear } from './utilities.service'

type UserProviderType = {
  userDetails: UserDetails | undefined
  storeUserDetails: (userDetails: UserDetails) => void
  clearUserDetails: () => void
}

const defaultUser = {
  userDetails: undefined,
  storeUserDetails: (_: UserDetails) => {},
  clearUserDetails: () => {},
}

const UserContext = createContext<UserProviderType>(defaultUser)

function getUserDetailsOrUndefined(): UserDetails | undefined {
  const storedUserDetails = localStorage.getItem('userDetails')
  if (storedUserDetails) return plainToInstance(UserDetails, JSON.parse(storedUserDetails))
}

/* The username can be retrieved and set from anywhere in the app. */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const axiosInstance = useContext(AxiosContext)
  const { pathname } = useLocation()

  const { addToast } = useToast()

  const [userDetails, setUserDetails] = useState<UserDetails | undefined>(
    getUserDetailsOrUndefined()
  )

  const storeUserDetails = (userDetails: UserDetails) => {
    setUserDetails(userDetails)
    localStorage.setItem('userDetails', JSON.stringify(instanceToPlain(userDetails)))
  }

  const clearUserDetails = () => {
    setUserDetails(undefined)
    localStorage.removeItem('userDetails')
  }

  const {
    params: { year },
  } = matchPath({ path: '/:year/*' }, pathname) ?? { params: {} }
  useEffect(() => {
    // User details are only fetched on pages whose URL starts with a short year,
    // iff user details for that short year have not been fetched yet
    if (
      userDetails === undefined ||
      !year ||
      !year.match(SHORT_YEAR_REGEX) ||
      year === userDetails.year
    )
      return
    axiosInstance
      .request({ method: 'GET', url: endpoints.personal(year) })
      .then(({ data }: { data: any }) => {
        if (!data?.length) throw new Error(`No user details found for ${year}`)
        storeUserDetails(plainToInstance(UserDetails, data[0]))
      })
      .catch((e: any) => {
        addToast({
          variant: 'error',
          title: `Sorry, you don't have any info for ${formatShortYear(year)}`,
        })
        console.error(e)
      })
  }, [addToast, axiosInstance, userDetails, year])

  return (
    <UserContext.Provider value={{ userDetails, storeUserDetails, clearUserDetails }}>
      {children}
    </UserContext.Provider>
  )
}

/* Allow user information to be accessed and updated in any functional component using the following hook: */
export const useUser = () => useContext(UserContext)
