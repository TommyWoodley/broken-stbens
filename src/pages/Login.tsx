import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import titles from '../constants/titles'
import { useToast } from '../lib/toast.context'
import { ThemeContext } from '../lib/theme.context'
import { Container } from '../styles/_app.style'
import { ActionButton } from '../styles/dialog.style'
import { Fieldset, Form, Input, Label, Logo, Name, Tagline } from '../styles/login.style'
import { SCHOOL_NAME } from '../constants/titles'

/* TODO: Add a help toggle to the login form (i.e. information for new users to the platform) */
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { addToast } = useToast()

  const { theme } = useContext(ThemeContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here we can handle what students are trying to do
    console.log("Trying username: " + username + " password: " + password)
    let query = "SELECT * FROM Users WHERE UserId = '" + username + "' AND PassWord = '" + password + "' ;"
    if (query.includes("--")) {
      query = query.slice(0, query.indexOf("--"))
    }
    console.log(query)

    let lowerUN = username.toLowerCase()

    if (lowerUN.includes("'") && lowerUN.includes("--") && lowerUN.includes("or") && lowerUN.includes("=")) {
      let eqIndex = lowerUN.indexOf("=")
      let startIndex = lowerUN.indexOf("or") + 2
      let endIndex = lowerUN.indexOf(" ", eqIndex) === -1 ? lowerUN.length : lowerUN.indexOf(" ", eqIndex);

      let str1 = username.slice(startIndex, eqIndex).trim()
      let str2 = username.slice(eqIndex + 1, endIndex).trim()

      if (str1 === str2) {
        return;
      }
    }

    addToast({ variant: 'error', title: 'Incorrect Username or Password' })
  }

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
