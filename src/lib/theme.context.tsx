import React, { createContext, useEffect, useState } from 'react'

import { darkTheme, theme as lightTheme } from '../styles/stitches.config'

/**
 * Code for the theme provider was heavily inspired by Lucas Arundell (lucastobrazil):
 * https://codesandbox.io/s/stitches-dark-mode-te4ne
 * Lucas in turn references Okiki Ojo's post as inspiration:
 * https://bit.ly/3qIldSj
 *
 * The code uses Okiki's method of combining matchMedia, localStorage, and Stitches to
 * allow a user to toggle through multiple colour modes whilst also taking into account
 * the user's default OS theme preferences.
 *
 * To add a new theme:
 * 1. Create it in the stitches configuration file (see styles)
 * 2. Import the theme on line 2 and add it to the list of available themes (below)
 */

type Theme = string
type ThemeProviderType = { theme: Theme; toggleTheme: () => void }
type Themes = {
  [x: string]: string
}

const defaultTheme: ThemeProviderType = {
  theme: '',
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeProviderType>(defaultTheme)

/**
 * A dictionary of available themes
 * The value of each key returns the className from stitches' createTheme()
 */
const themes: Themes = {
  light: lightTheme.className /* Default theme on Stitches */,
  dark: darkTheme.className,
}

const saveTheme = (newTheme: Theme) => {
  try {
    if (typeof newTheme === 'string') window.localStorage.setItem('theme', newTheme)
  } catch (e) {
    console.warn(e)
  }
}

const getSavedThemePreference = (): Theme => {
  try {
    const savedTheme = window.localStorage.getItem('theme')
    /* If user has explicitly chosen a theme, it's applied. Else, the value's empty. */
    if (typeof savedTheme === 'string') return savedTheme
  } catch (e) {
    /* localStorage cannot be accessed in incognito mode on Chrome */
    console.warn(e)
    return ''
  }
  return ''
}

const getMediaTheme = (): Theme => {
  /* If the user hasn't explicity set a theme, then we check the media query */
  const mediaQueryList = matchMedia('(prefers-color-scheme: dark)')
  const hasMediaQueryPreference = typeof mediaQueryList.matches === 'boolean'
  if (hasMediaQueryPreference) return mediaQueryList.matches ? 'dark' : 'light'
  return ''
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(defaultTheme.theme)
  const html = document.documentElement

  /* Set theme in localStorage, as well as in the html tag */
  const applyTheme = (newTheme: Theme) => {
    html.classList.remove(themes[theme])
    html.classList.add(themes[newTheme])
    /* Add and remove animation override for smooth theme transition */
    document.body.classList.add('animate')
    setTimeout(() => document.body.classList.remove('animate'), 1000)
    setTheme(newTheme)
  }

  let savedTheme = getSavedThemePreference()
  if (savedTheme === '') {
    /* If no localStorage exists, use the user's OS setting */
    savedTheme = getMediaTheme()
  }
  html.classList.add(themes[savedTheme])

  /* Re-render when the dependency, savedTheme, changes. */
  useEffect(() => {
    setTheme(savedTheme)
  }, [savedTheme])

  /**
   * Check if the user changes the OS theme, but don't save it in localStorage.
   * TODO: "Sync with system" option
   */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    applyTheme(e.matches ? 'dark' : 'light')
  })

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    applyTheme(e.matches ? 'light' : 'dark')
  })

  /* Cycle between the available themes; code supports more than two themes! */
  const toggleTheme = (): void => {
    const keys = Object.keys(themes)
    let index = keys.indexOf(theme)
    if (index === keys.length - 1) {
      index = 0
    } else if (index >= 0) {
      index = index + 1
    }
    const newTheme = keys[index]
    applyTheme(newTheme)
    saveTheme(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
