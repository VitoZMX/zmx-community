import React, {useContext} from 'react'
import {privateRoutes, publicRoutes} from '../routes'
import {Navigate, Route, Routes} from 'react-router-dom'
import {CHAT_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE} from '../utils/constRoute'
import {useAuthState} from 'react-firebase-hooks/auth'
import {Context} from '../index'
import {Preloader} from './common/Preloader'

export function AppRouter() {
    const {auth} = useContext(Context)
    const [user, loading] = useAuthState(auth)

    if (loading) {
        return <Preloader/>
    }

    return user ?
        (
            <Routes>
                {privateRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} Component={Component}/>
                )}
                <Route path="/chat" element={<Navigate to={CHAT_ROUTE}/>}/>
                <Route path="/profile" element={<Navigate to={PROFILE_ROUTE}/>}/>
                <Route path="/news" element={<Navigate to={PROFILE_ROUTE}/>}/>
                <Route path="/*" element={<Navigate to={CHAT_ROUTE}/>}/>
            </Routes>
        )
        :
        (
            <Routes>
                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} Component={Component}/>
                )}
                <Route path="/profile" element={<Navigate to={PROFILE_ROUTE}/>}/>
                <Route path="/*" element={<Navigate to={LOGIN_ROUTE}/>}/>
            </Routes>
        )
}