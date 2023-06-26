import {
    CHAT_ROUTE,
    HOME_ROUTE,
    LOGIN_ROUTE,
    MORE_NEWS_ROUTE,
    NEWS_ROUTE,
    PROFILE_ID_ROUTE,
    PROFILE_ROUTE,
    SETTING_ROUTE,
    TODO_ROUTE,
    USERS_ROUTE
} from './utils/constRoute'
import {Login} from './components/Login'
import {Chat} from './components/Chat'
import {ProfilePage} from './components/ProfilePage/ProfilePage'
import {NewsPage} from './components/NewsPage'
import {ToDoList} from './components/ToDoList'
import {NewsMore} from './components/NewsMore'
import {SettingPage} from './components/SettingPage'
import {HomePage} from './components/HomePage'
import {UsersPage} from './components/UsersPage/UsersPage'

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: HomePage
    },
    {
        path: LOGIN_ROUTE,
        Component: Login
    },
    {
        path: PROFILE_ID_ROUTE,
        Component: ProfilePage
    },
    {
        path: MORE_NEWS_ROUTE,
        Component: NewsMore
    }
]

export const privateRoutes = [
    {
        path: HOME_ROUTE,
        Component: HomePage
    },
    {
        path: PROFILE_ID_ROUTE,
        Component: ProfilePage
    },
    {
        path: PROFILE_ROUTE,
        Component: ProfilePage
    },
    {
        path: USERS_ROUTE,
        Component: UsersPage
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
    },
    {
        path: SETTING_ROUTE,
        Component: SettingPage
    }
]