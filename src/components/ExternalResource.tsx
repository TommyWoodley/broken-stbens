import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { baseURL } from '../constants/endpoints'
import useQueryParams from '../lib/queryParams.service'
import useTokenRefresh from '../lib/tokenRefresh.service'
import { shortYear } from '../lib/utilities.service'
import { Banner, Container } from '../styles/_app.style'

const ExternalResource = () => {
  const queryParams = useQueryParams()
  const url = queryParams.get('url')

  const { refreshAccessToken } = useTokenRefresh()

  // Redirect to `url`. Make sure to refresh access token
  // if the URL is under the Scientia-API domain
  useEffect(() => {
    if (url) {
      if (url.startsWith(baseURL)) refreshAccessToken().then(() => (window.location.href = url))
      else window.location.href = url
    }
  }, [refreshAccessToken, url])

  return url ? (
    <Container>
      <Banner center>Opening resource...</Banner>
    </Container>
  ) : (
    <Navigate to={`/${shortYear()}/modules`} replace />
  )
}

export default ExternalResource
