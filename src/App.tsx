import React, {createContext, useEffect, useMemo, useState} from 'react'
import './App.css'
import './styles/theme.css'
import {Navbar} from './components/Navbar'
import {HashRouter} from 'react-router-dom'
import {AppRouter} from './components/AppRouter'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {getApps, initializeApp} from 'firebase/app'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {doc, getDoc, getFirestore, setDoc} from 'firebase/firestore'
import {firebaseConfig} from './firebaseConfig'
import {Preloader} from './components/common/Preloader'
import {ContextType, defaultThemeSettings, RolePermissionsMap, ThemeSettings, userType} from './types/types'
import {defaultRolePermissions} from './roles'
import {I18nProvider} from './i18n'

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
export type FirebaseUserAndUserType = userType & ReturnType<typeof getAuth>
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)
export const Context = createContext<ContextType>({auth, firestore, user: null, setUser: () => {}, userFriends: [], setUserFriends: () => {}, rolePermissions: defaultRolePermissions, setRolePermissions: () => {}})

const darkColors = {primary: '#90caf9', secondary: '#ce93d8', background: '#121212', surface: '#1e1e1e'}
const themePresets = {
    ocean: {primary: '#0284c7', secondary: '#14b8a6', background: '#f0f9ff', surface: '#ffffff'},
    sunset: {primary: '#ea580c', secondary: '#db2777', background: '#fff7ed', surface: '#ffffff'},
    forest: {primary: '#15803d', secondary: '#a16207', background: '#f0fdf4', surface: '#ffffff'}
}
const THEME_STORAGE_KEY = 'zmx-community-theme-v1'
const getStoredTheme = (): ThemeSettings | undefined => { try { const value = localStorage.getItem(THEME_STORAGE_KEY); return value ? JSON.parse(value) as ThemeSettings : undefined } catch { return undefined } }
const resolveTheme = (settings?: ThemeSettings) => {
    const value = settings || defaultThemeSettings
    if (value.mode === 'dark') return {...darkColors, mode: 'dark' as const}
    if (value.mode === 'custom') return value
    if (value.mode === 'ocean' as ThemeSettings['mode']) return {...themePresets.ocean, mode: 'light' as const}
    if (value.mode === 'sunset' as ThemeSettings['mode']) return {...themePresets.sunset, mode: 'light' as const}
    if (value.mode === 'forest' as ThemeSettings['mode']) return {...themePresets.forest, mode: 'light' as const}
    return {...defaultThemeSettings, mode: 'light' as const}
}

export function App() {
    const [user, setUser] = useState<FirebaseUserAndUserType | null>(() => { const cached = getStoredTheme(); return cached ? ({theme: cached} as FirebaseUserAndUserType) : null })
    const [userFriends, setUserFriends] = useState<userType[]>([])
    const [rolePermissions, setRolePermissions] = useState<RolePermissionsMap>(defaultRolePermissions)
    const [loading, setLoading] = useState(true)
    const resolved = resolveTheme(user?.theme)
    const paletteMode: 'light' | 'dark' = resolved.mode === 'dark' ? 'dark' : 'light'
    useEffect(() => { try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(user?.theme || defaultThemeSettings)) } catch {} }, [user?.theme])
    const theme = useMemo(() => createTheme({
        palette: {mode: paletteMode, primary: {main: resolved.primary}, secondary: {main: resolved.secondary}, background: {default: resolved.background, paper: resolved.surface}, text: resolved.mode === 'dark' ? {primary: '#fff', secondary: '#c7c7c7'} : {primary: '#17202a', secondary: '#4b5563'}},
        typography: {fontFamily: 'Roboto, Arial, sans-serif', body1: {lineHeight: 1.6}},
        components: {
            MuiCssBaseline: {styleOverrides: {body: {backgroundColor: resolved.background, color: resolved.mode === 'dark' ? '#fff' : '#17202a'}}},
            MuiCard: {styleOverrides: {root: {borderRadius: 12}}},
            MuiPaper: {styleOverrides: {root: {backgroundImage: 'none'}}},
            MuiTextField: {defaultProps: {variant: 'outlined'}},
            MuiButton: {styleOverrides: {root: {textTransform: 'none'}}}
        }
    }), [paletteMode, resolved.background, resolved.mode, resolved.primary, resolved.secondary, resolved.surface])

    useEffect(() => onAuthStateChanged(auth, async firebaseUser => {
        try {
            if (!firebaseUser) {setUser(null); return}
            const userRef = doc(firestore, 'users', firebaseUser.uid)
            const snapshot = await getDoc(userRef)
            if (snapshot.exists()) setUser({...firebaseUser, ...auth, ...(snapshot.data() as userType)})
            const permissionsSnapshot = await getDoc(doc(firestore, 'config', 'rolePermissions'))
            if (permissionsSnapshot.exists()) setRolePermissions({...defaultRolePermissions, ...(permissionsSnapshot.data() as RolePermissionsMap)})
            else {
                const data: userType = {uid: firebaseUser.uid, displayName: firebaseUser.displayName || '', email: firebaseUser.email, age: '', sex: 'Не указано', country: '', aboutYou: '', barkMode: false, photoURL: firebaseUser.photoURL, role: 'user', friends: [], qBPostsId: [], theme: defaultThemeSettings}
                await setDoc(userRef, data); setUser({...firebaseUser, ...auth, ...data})
            }
        } catch (error) {console.error('Не удалось загрузить профиль пользователя', error); setUser(null)} finally {setLoading(false)}
    }), [])

    return <I18nProvider><HashRouter><ThemeProvider theme={theme}><CssBaseline/><Context.Provider value={{auth, firestore, user, setUser, userFriends, setUserFriends, rolePermissions, setRolePermissions}}>{loading ? <Preloader/> : <><Navbar/><AppRouter/></>}</Context.Provider></ThemeProvider></HashRouter></I18nProvider>
}
