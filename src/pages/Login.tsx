import {useContext, useEffect, useState} from 'react'
import { Helmet } from 'react-helmet-async'

import titles from '../constants/titles'
import { ThemeContext } from '../lib/theme.context'
import { Container } from '../styles/_app.style'
import { ActionButton } from '../styles/dialog.style'
import { Fieldset, Form, Input, Label, Logo, Name, Tagline } from '../styles/login.style'
import { SCHOOL_NAME } from '../constants/titles'
import useAuth from "../lib/authenticator";
import {useToast} from "../lib/toast.context";

/* TODO: Add a help toggle to the login form (i.e. information for new users to the platform) */
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser, isLoggedIn } = useAuth()
  const { addToast } = useToast()

  const { theme } = useContext(ThemeContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    loginUser(username, password)
  }

  useEffect(() => {
    if (isLoggedIn) addToast({ variant: 'success', title: 'Yayyy - You broken into the admin account' })
  }, [isLoggedIn, addToast])

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

        <Name>{SCHOOL_NAME}</Name>
        <Tagline style={{ marginBottom: '2rem' }}>Super Secure Website</Tagline>

        <Fieldset>
          <Label htmlFor="Username">Username</Label>
          <Input
            name="Username"
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
