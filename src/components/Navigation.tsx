import { DropdownMenu, DropdownMenuTrigger, ItemIndicator } from '@radix-ui/react-dropdown-menu'
import { useContext } from 'react'
import {
  BarChart,
  Book,
  CalendarDate,
  Check,
  Dice5Fill,
  DoorClosedFill,
  GearWideConnected,
  Justify,
  MoonFill,
  SunFill,
} from 'react-bootstrap-icons'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { LINKS } from '../constants/links'
import useAuth from '../lib/auth.service'
import { globalGameEnabled, useGame } from '../lib/game/game.context'
import { ThemeContext } from '../lib/theme.context'
import { useUser } from '../lib/user.context'
import { capitaliseFirstLetter, formatShortYear, shortYear } from '../lib/utilities.service'
import { Button } from '../styles/_app.style'
import { ActionButton } from '../styles/dialog.style'
import {
  CheckboxItem,
  Content,
  DropdownIcon,
  Header,
  Item,
  Logo,
  Nav,
  ScientiaTitle,
  Separator,
  ShortcutLink,
  VerticalRule,
  WebsiteTitle,
} from '../styles/navigation.style'
import TimelineGuideButton from './TimelineGuide'
import { YearSwitcher } from './YearSwitcher'

/**
 * TODO: Extract the colours as a constant and implement functionality for the buttons!
 * TODO: Show a banner under the header if the requested year isn't the current year.
 */
export const Navigation = () => {
  const { userDetails } = useUser()
  const { logoutUser } = useAuth()
  const { year } = useParams()
  const currentYear = shortYear()
  const { theme, toggleTheme } = useContext(ThemeContext)
  const { gameSettingOn, toggleGameSetting } = useGame()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()
  const { pathname } = useLocation()
  const [homePage, shortcutTarget] = userDetails?.isStaff
    ? ['modules', 'timeline']
    : ['timeline', 'modules']
  return (
    <Header>
      <Nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ScientiaTitle
            href={isLoggedIn ? `/${year}/${homePage}` : '/'}
            title={`View ${homePage}`}
          >
            <Logo
              alt="Scientia logo"
              src="/assets/logo-light.svg"
              style={{ filter: `invert(${theme === 'dark' ? 1 : 0})` }}
            />
            <WebsiteTitle>Scientia</WebsiteTitle>
          </ScientiaTitle>
          <VerticalRule />
          <ShortcutLink href={`/${year}/timeline`} title="View timeline">
            <CalendarDate size={22} />
          </ShortcutLink>
          <ShortcutLink href={`/${year}/modules`} title="View Modules">
            <Book size={22} />
          </ShortcutLink>
          {globalGameEnabled && (
            <ShortcutLink href={`/${year}/analytics`} title={`View Game Analytics`}>
              <BarChart size={22} />
            </ShortcutLink>
          )}

          {year !== currentYear && (
            <ActionButton.Primary
              style={{ padding: '0.5rem 1rem' }}
              onClick={() => navigate('/' + currentYear + window.location.pathname.slice(5))}
            >
              Go to {formatShortYear()}
            </ActionButton.Primary>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TimelineGuideButton />

          {/* Quick Links */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon title="Useful websites">
                <Justify size={22} />
              </Button>
            </DropdownMenuTrigger>
            <Content align="start">
              {LINKS.map((link) => (
                <a
                  href={link.url}
                  key={link.title}
                  target="_blank"
                  rel="noreferrer"
                  title={link.description}
                >
                  <Item link style={{ padding: '0.5rem' }}>
                    <link.icon size={16}></link.icon>
                    {link.title}
                  </Item>
                </a>
              ))}
            </Content>
          </DropdownMenu>

          {/* User Preferences */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon title="User preferences">
                <GearWideConnected size={22} />
              </Button>
            </DropdownMenuTrigger>
            <Content align="start">
              <Item
                onSelect={toggleTheme}
                title={`Use a ${theme === 'light' ? 'dark' : 'light'} appearance`}
              >
                <DropdownIcon>{theme === 'light' ? <MoonFill /> : <SunFill />}</DropdownIcon>
                <span>{capitaliseFirstLetter(theme === 'light' ? 'dark' : 'light') + ' mode'}</span>
              </Item>
              <Separator />
              <YearSwitcher />
              <Separator />

              {globalGameEnabled && !userDetails?.isStaff && (
                <>
                  <CheckboxItem checked={gameSettingOn} onCheckedChange={toggleGameSetting}>
                    <Dice5Fill size={20} style={{ margin: '0 0.5rem' }} />
                    <span style={{ flexGrow: 1 }}>Game Levels</span>
                    <ItemIndicator>
                      <Check size={30} />
                    </ItemIndicator>
                  </CheckboxItem>
                  <Separator />
                </>
              )}
              <Item onSelect={logoutUser}>
                <DropdownIcon>
                  <DoorClosedFill size={20} />
                </DropdownIcon>
                Logout
              </Item>
            </Content>
          </DropdownMenu>
        </div>
      </Nav>
    </Header>
  )
}
