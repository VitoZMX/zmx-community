import React, {useContext} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import { Context } from '../App'
import {useAuthState} from 'react-firebase-hooks/auth'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

export function Profile() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)

    return (
        <Container style={{marginTop: '80px'}}>
            <Grid container spacing={1} alignItems="stretch">
                <Grid item sm={12} md={4}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        height: '100%'
                    }}>
                        <Avatar alt={user?.displayName || 'ProfileAvatar'}
                                src={user?.photoURL || undefined}
                                sx={{width: 200, height: 200, boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'}}
                        />
                        <Typography variant="h5" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'black'
                        }}>{user?.email}</Typography>
                        <h4>Тут должна быть информация о тебе брат!Тут должна быть информация о тебе брат!Тут должна
                            быть
                            информация о тебе брат!Тут должна быть информация о тебе брат!Тут должна быть информация о
                            тебе
                            брат!</h4>
                        <Typography variant="subtitle2" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'white'
                        }}>Account created: {user?.metadata.creationTime}</Typography>
                        <Typography variant="subtitle2" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'white'
                        }}>ID: {user?.uid}</Typography>
                    </div>
                </Grid>
                <Grid item md={8} sm={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        padding: '15px',
                        height: '100%'
                    }}>
                        <Typography variant="h3" sx={{
                            mr: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: 'Roboto',
                            fontWeight: 350,
                            color: 'black'
                        }}>{user?.displayName}</Typography>
                        <h4>И тут тоже нужно что то написать о тебе, братишка! И тут тоже нужно что то написать о тебе,
                            братишка!И тут тоже нужно что то написать о тебе, братишка!И тут тоже нужно что то написать
                            о
                            тебе, братишка!</h4>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        padding: '15px'
                    }}>
                        <h4>Блок для добавление новости. xs=12 Блок для добавление новости. xs=12Блок для добавление
                            новости. xs=12Блок для добавление новости. xs=12Блок для добавление новости. xs=12Блок для
                            добавление новости. xs=12Блок для добавление новости. xs=12Блок для добавление новости.
                            xs=12Блок для добавление новости. xs=12Блок для добавление новости. xs=12</h4>
                    </div>
                </Grid>
            </Grid>
        </Container>
    )
}