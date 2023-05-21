import React, {useContext} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {Context} from '../index'
import {useAuthState} from 'react-firebase-hooks/auth'

export function NewsPage() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    return (
        <Container style={{marginTop: '80px'}}>
            <Grid container spacing={2} alignItems="stretch">
                <Grid item md={4}>
                    News ZMX Community 1
                </Grid>
                <Grid item md={4}>
                    News ZMX Community 2
                </Grid>
                <Grid item md={4}>
                    News ZMX Community 3
                </Grid>
                <Grid item md={4}>
                    News ZMX Community 4
                </Grid>
            </Grid>
        </Container>
    )
}