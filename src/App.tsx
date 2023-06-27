import React, {createContext, useEffect, useState} from 'react'
import './App.css'
import {Navbar} from './components/Navbar'
import {HashRouter} from 'react-router-dom'
import {AppRouter} from './components/AppRouter'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {initializeApp} from 'firebase/app'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {doc, getDoc, getFirestore, setDoc} from 'firebase/firestore'
import {firebaseConfig} from './firebaseConfig'
import {Preloader} from './components/common/Preloader'
import {ContextType, userType} from './types/types'

initializeApp(firebaseConfig)

export type FirebaseUserAndUserType = userType & ReturnType<typeof getAuth>

const auth = getAuth()
const firestore = getFirestore()

export const Context = createContext<ContextType>({
    auth: getAuth(),
    firestore: getFirestore(),
    user: null,
    setUser: () => {
    },
    userFriends: [],
    setUserFriends: () => {
    },
})

export function App() {
    const [user, setUser] = useState<FirebaseUserAndUserType | null>(null)
    const [userFriends, setUserFriends] = useState<userType[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const theme = createTheme({
        palette: {
            background: {
                default: '#e0e5ea'
            },
        },
    })

    useEffect(() => {
        setLoading(true)


        const unsubscribe = onAuthStateChanged(auth, async (user) => {

                if (user) {
                    // Получить UID пользователя
                    const uid = user.uid

                    // Получить ссылку на документ пользователя
                    const userDocRef = doc(getFirestore(), 'users', uid)

                    // Получить данные документа пользователя
                    const userDoc = await getDoc(userDocRef)
                    const userData = userDoc.data() as userType

                    if (userDoc.exists()) {
                        setUser({...user, ...auth, ...userData})
                        setLoading(false)
                        console.log('Данные пользователя:', userData)
                    } else {
                        const newUserData = {
                            uid: user.uid,
                            displayName: user.displayName,
                            email: '',
                            age: '',
                            sex: 'Не указано',
                            country: '',
                            aboutYou: '',
                            barkMode: false,
                            photoURL: user.photoURL,
                            role: 'User',
                            friends: [],
                            qBPostsId: []
                        }
                        const userDocRef = doc(getFirestore(), 'users', user.uid)
                        await setDoc(userDocRef, newUserData)
                        setUser({...user, ...auth, ...userData})
                        console.log('Успешная первая отправка!')
                    }
                } else {
                    setUser(null) // Очистить состояние пользователя при выходе из системы
                    setLoading(false)
                }
            }
        )
        return () => unsubscribe()
    }, [])

    return (
        <HashRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Context.Provider value={{
                    auth,
                    firestore,
                    user, setUser,
                    userFriends, setUserFriends
                }}>
                    <div>
                        {loading ?
                            (<Preloader/>) :
                            (<div>
                                <Navbar/>
                                <AppRouter/>
                            </div>)
                        }
                    </div>
                </Context.Provider>
            </ThemeProvider>
        </HashRouter>
    )
}