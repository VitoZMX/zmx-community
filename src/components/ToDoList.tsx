import React, {useContext} from 'react'
import Grid from '@mui/material/Grid'
import {useAuthState} from 'react-firebase-hooks/auth'
import { Context } from '../App'
import Container from "@mui/material/Container";

export function ToDoList() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    return (
        <Container style={{marginTop: '80px'}}>
            <Grid container spacing={1} alignItems="stretch">
                <h1>To Do List page</h1>
            </Grid>
        </Container>
    )
}