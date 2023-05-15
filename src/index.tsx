import React, {createContext} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {initializeApp} from 'firebase/app'

const firebaseConfig = {
    apiKey: 'AIzaSyCK1X-4ggloNpwbTbPIndcOQcSQWK6Jw1I',
    authDomain: 'zmx-chat.firebaseapp.com',
    projectId: 'zmx-chat',
    storageBucket: 'zmx-chat.appspot.com',
    messagingSenderId: '678272987448',
    appId: '1:678272987448:web:ce28ca7c4bbfb7e992d1cd',
    measurementId: 'G-SHGJGCMPFK'
}
initializeApp(firebaseConfig)

type ContextType = {
    auth: ReturnType<typeof getAuth>;
    firestore: ReturnType<typeof getFirestore>;
}

export const Context = createContext<ContextType>({
    auth: getAuth(),
    firestore: getFirestore(),
})

const auth = getAuth()
const firestore = getFirestore()

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)
root.render(
    <Context.Provider value={{
        auth,
        firestore
    }}>
        <App/>
    </Context.Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
