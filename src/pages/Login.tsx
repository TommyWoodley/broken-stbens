import { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'

import titles from '../constants/titles'
import useAuth from '../lib/auth.service'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { shortYear } from '../lib/utilities.service'
import { Container } from '../styles/_app.style'
import { ActionButton } from '../styles/dialog.style'
import { Fieldset, Form, Input, Label, Logo, Name, Tagline } from '../styles/login.style'
import { LocationState } from '../types/global'

/* TODO: Add a help toggle to the login form (i.e. information for new users to the platform) */
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { loginUser, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { theme } = useContext(ThemeContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here we can handle what student's are trying to do
    console.log("Trying username: " + username + " password: " + password)

  }

  const { userDetails } = useUser()
  const homePath = `/${shortYear()}/${userDetails?.isStaff ? 'modules' : 'timeline'}`

  useEffect(() => {
    const { next } = (state as LocationState) || { next: undefined }
    if (isLoggedIn) navigate(next || homePath, { replace: true })
  }, [isLoggedIn, navigate, state, homePath])

  return (
    <Container center expand dotted css={{ paddingTop: 0 }}>
      <Helmet>
        <title>{titles.login}</title>
      </Helmet>
      <Form onSubmit={handleSubmit}>
        <Logo
          alt="St Benedict's logo"
          src="assets/logo.png"
          style={{ filter: `invert(${theme === 'dark' ? 1 : 0})` }}
        />
        <Name>St Benedicts</Name>
        <Tagline style={{ marginBottom: '2rem' }}>Please don't hack into me</Tagline>

        <Fieldset>
          <Label htmlFor="Username">Username</Label>
          <Input
            name="Username"
            autoComplete="username"
            value={username}
            placeholder="abc123"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Fieldset>

        <Fieldset>
          <Label htmlFor="Password">Password</Label>
          <Input
            name="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Fieldset>

        <ActionButton.Primary type="submit" style={{ padding: '2rem inherit' }}>
          Login
        </ActionButton.Primary>
      </Form>
    </Container>
  )
}

export default Login
