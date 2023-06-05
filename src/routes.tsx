import {CHAT_ROUTE, LOGIN_ROUTE, MORE_NEWS_ROUTE, NEWS_ROUTE, PROFILE_ROUTE, TODO_ROUTE} from './utils/constRoute'
import {Login} from './components/Login'
import {Chat} from './components/Chat'
import {Profile} from './components/Profile'
import {NewsPage} from './components/NewsPage'
import {ToDoList} from './components/ToDoList'
import {NewsMore} from './components/NewsMore'

export const publicRoutes = [
    {
        path: PROFILE_ROUTE,
        Component: Profile
    },
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: MORE_NEWS_ROUTE,
        Component: NewsMore
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
    },
    {
        path: TODO_ROUTE,
        Component: ToDoList
    },
    {
        path: NEWS_ROUTE,
        Component: NewsPage
    },
    {
        path: MORE_NEWS_ROUTE,
        Component: NewsMore
    }
]