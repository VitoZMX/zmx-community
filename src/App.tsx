import React, {createContext, useState} from 'react'
import './App.css'
import {Navbar} from './components/Navbar'
import {HashRouter} from 'react-router-dom'
import {AppRouter} from './components/AppRouter'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {User as FirebaseUser} from '@firebase/auth'
import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {firebaseConfig} from './firebaseConfig'

initializeApp(firebaseConfig)

type ContextType = {
    auth: ReturnType<typeof getAuth>;
    firestore: ReturnType<typeof getFirestore>;
    user: FirebaseUser | null;
    setUser: (user: FirebaseUser | null) => void;
}
const auth = getAuth()
const firestore = getFirestore()

export const Context = createContext<ContextType>({
    auth: getAuth(),
    firestore: getFirestore(),
    user: null,
    setUser: () => {
    },
})

export function App() {
    const [user, setUser] = useState<FirebaseUser | null>(null)

    const theme = createTheme({
        palette: {
            background: {
                default: '#e0e5ea'
            },
        },
    })

    return (
        <HashRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Context.Provider value={{
                    auth,
                    firestore,
                    user, setUser
                }}>
                    <div>
                        <Navbar/>
                        <AppRouter/>
                    </div>
                </Context.Provider>
            </ThemeProvider>
        </HashRouter>
    )
}