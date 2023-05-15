import {CHAT_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE} from './utils/constRoute'
import {Login} from './components/Login'
import {Chat} from './components/Chat'
import {Profile} from './components/Profile'

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Login
    }
]

export const privateRoutes = [
    {
        path: CHAT_ROUTE,
        Component: Chat
    },
    {
        path: PROFILE_ROUTE,
        Component: Profile
    }
]