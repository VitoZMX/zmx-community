import React, {useContext} from 'react'
import {Container, Grid} from '@material-ui/core'
import {Context} from '../index'
import {useAuthState} from 'react-firebase-hooks/auth'

export function Profile() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    return (
        <Container>
            <Grid
                container
                justifyContent="center"
            >
                <div style={{marginTop:'150px'}}>
                    <div>Profile Page</div>
                    <img  src={user?.photoURL || undefined} alt="User avatar"/>
                    <div>Name: {user?.displayName}</div>
                </div>
            </Grid>
        </Container>
    )
}