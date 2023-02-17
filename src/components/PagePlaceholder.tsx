import React from 'react'
import { Helmet } from 'react-helmet-async'

import { Banner, Container } from '../styles/_app.style'

const PagePlaceholder = ({
  title,
  header,
  text,
}: {
  title: string
  header: string
  text: string
}) => {
  return (
    <Container>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section style={{ marginBottom: '2rem' }}>
        <h1>{header}</h1>
      </section>
      <Banner center>
        <span>{text}</span>
      </Banner>
    </Container>
  )
}

export default PagePlaceholder
