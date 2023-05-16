import {CHAT_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE} from './utils/constRoute'
import {Login} from './components/Login'
import {Chat} from './components/Chat'
import {Profile} from './components/Profile'

export const publicRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: LOGIN_ROUTE,
        Component: Login
    }
]

export const privateRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: CHAT_ROUTE,
        Component: Chat
    }
]