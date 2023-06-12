import React, {useContext} from 'react'
import {privateRoutes, publicRoutes} from '../routes'
import {Navigate, Route, Routes} from 'react-router-dom'
import {LOGIN_ROUTE, PROFILE_ROUTE} from '../utils/constRoute'
import {useAuthState} from 'react-firebase-hooks/auth'
import {Context} from '../App'
import {Preloader} from './common/Preloader'

export function AppRouter() {
    const {auth} = useContext(Context)
    const {user} = useContext(Context)
    const [profile, loadingUser] = useAuthState(auth)

    if (loadingUser) {
        return <Preloader/>
    }

    return user ?
        (
            <Routes>
                {privateRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} Component={Component}/>
                )}
                <Route path="/*" element={<Navigate to={PROFILE_ROUTE}/>}/>
            </Routes>
        )
        :
        (
            <Routes>
                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path} Component={Component}/>
                )}
                <Route path="/*" element={<Navigate to={LOGIN_ROUTE}/>}/>
            </Routes>
        )
}