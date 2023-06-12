import React, {useContext, useEffect, useState} from 'react'
import logo from '../assets/image/logozmx.svg'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import {ButtonBase, Grid} from '@material-ui/core'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {NavLink, useNavigate} from 'react-router-dom'
import {LOGIN_ROUTE} from '../utils/constRoute'
import {useAuthState} from 'react-firebase-hooks/auth'
import Avatar from '@mui/material/Avatar'
import {IconButton, Menu, MenuItem, Tooltip} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import ChatIcon from '@mui/icons-material/Chat'
import {Context} from '../App'

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
        }
    }
})

export function Navbar() {
    const {auth} = useContext(Context)
    const [profile, loadingUser] = useAuthState(auth)
    const {user, setUser} = useContext(Context)
    const [loading, setLoading] = useState<boolean>(true)
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
    const navigate = useNavigate()

    //setUser(profile)

    const handleLinkClick = () => {
        navigate('/home')
    }
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }
    const handleLogoutClick = () => {
        setAnchorElUser(null)
        setUser(null)
        auth.signOut()
    }

    const getFirstNameUser = (str: string | null) => {
        if (!str) {
            return
        }
        const words = str.split(' ')
        const nameUser = words[0].charAt(0).toUpperCase() + words[0].slice(1)
        return nameUser
    }

    const settings = [
        {text: 'My Profile', link: '/profile', icon: <PersonIcon/>},
        {text: 'Friends', link: '/friends', icon: <PeopleIcon/>},
        {text: 'Chat', link: '/chat', icon: <ChatIcon/>},
        {text: 'News', link: '/news', icon: <NewspaperIcon/>},
        {text: 'To Do List', link: '/todo', icon: <FormatListBulletedIcon/>},
        {text: 'Settings', link: '/settings', icon: <SettingsIcon/>},
        {text: 'Log out', link: '/login', icon: <LogoutIcon/>, onClick: handleLogoutClick},
    ]

    useEffect(() => {
        setLoading(true)
        if (loadingUser === false) {
            setLoading(false)
        }
    }, [loadingUser])

    return (
        <AppBar position="fixed" style={{backgroundColor: 'rgba(25, 118, 210, 0.8)', backdropFilter: 'blur(2px)'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters variant={'dense'}>
                    <Avatar src={logo} alt="logoNavBar" variant="square"
                            sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        style={{cursor: 'pointer'}}
                        onClick={handleLinkClick}
                        sx={{
                            mr: 6,
                            display: {xs: 'none', md: 'flex'},
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: 'Roboto',
                            fontWeight: 300,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >ZMX Community</Typography>
                    <Typography
                        style={{cursor: 'pointer'}}
                        variant="h5"
                        noWrap
                        onClick={handleLinkClick}
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            flexGrow: 1,
                            fontFamily: 'Roboto',
                            fontWeight: 200,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >ZMX</Typography>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container justifyContent={'flex-end'}>
                            <ThemeProvider theme={theme}>
                                {loading ?
                                    ('')
                                    : user ? (
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <Tooltip title="Menu">
                                                    <IconButton onClick={handleOpenUserMenu}
                                                                sx={{p: 0, padding: '0 16px', borderRadius: '10px'}}>
                                                        <Typography variant="body1" sx={{
                                                            color: 'white',
                                                            mr: 2,
                                                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                                                            fontFamily: 'Roboto',
                                                            fontWeight: 400,
                                                        }}>
                                                            {getFirstNameUser(user.displayName)}
                                                        </Typography>
                                                        <Avatar alt={user.displayName || 'ProfileAvatar'}
                                                                src={user.photoURL || undefined}
                                                                sx={{bgcolor: '#53b227'}}
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                                <Menu
                                                    sx={{mt: '40px'}}
                                                    id="menu-appbar"
                                                    anchorEl={anchorElUser}
                                                    anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    keepMounted
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    open={Boolean(anchorElUser)}
                                                    onClose={handleCloseUserMenu}
                                                >
                                                    {settings.map(({text, link, icon, onClick}) => (
                                                        <ButtonBase
                                                            component={NavLink}
                                                            to={link}
                                                            style={{display: 'flex', alignItems: 'center'}}
                                                        >
                                                            <MenuItem style={{width: '100%'}} key={text}
                                                                      onClick={onClick || handleCloseUserMenu}>
                                                                {icon}
                                                                <Typography sx={{ml: 2}}>{text}</Typography>
                                                            </MenuItem>
                                                        </ButtonBase>
                                                    ))}
                                                </Menu>
                                            </Box>
                                        )
                                        :
                                        (
                                            <NavLink to={LOGIN_ROUTE}>
                                                <Button variant={'outlined'}>Login</Button>
                                            </NavLink>
                                        )
                                }
                            </ThemeProvider>
                        </Grid>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}