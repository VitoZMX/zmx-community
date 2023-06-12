import React, {useContext} from 'react'
import {Box, Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {Context} from '../App'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import imgF from '../assets/image/logoNoImg.png'

export function Profile() {
    const {auth} = useContext(Context)
    const {user} = useContext(Context)

    return (
        <Container style={{marginTop: '80px'}}>
            <Grid container spacing={1} alignItems="stretch">
                <Grid item sm={12} lg={4} md={4} xs={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        height: '100%',
                    }}>
                        <CardMedia
                            sx={{
                                objectFit: 'cover', minHeight: '250px',
                                maxHeight: '400px', borderRadius: '12px  12px 0 0 '
                            }}
                            component="img"
                            image={user?.photoURL || imgF}
                            alt="Your avatar"
                        />
                        <div style={{padding: '10px'}}>
                            <Typography style={{marginBottom: '10px'}} variant="body1">Роль: {user?.role}</Typography>
                            <Typography variant="subtitle2" sx={{
                                mr: 2,
                                fontFamily: 'Roboto',
                                fontWeight: 100,
                                color: 'white'
                            }}>Account created: {user?.metadata?.creationTime}</Typography>
                            <Typography variant="subtitle2" sx={{
                                mr: 2,
                                fontFamily: 'Roboto',
                                fontWeight: 100,
                                color: 'white'
                            }}>ID: {user?.uid}</Typography>
                        </div>
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
                        <Typography variant="h4" sx={{
                            mr: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: 'Roboto',
                            fontWeight: 350,
                            color: 'black'
                        }}>{user?.displayName}</Typography>
                        <Box marginBottom={'8px'}>
                            <Typography variant="h6">Email:</Typography>
                            <Typography variant="body1">{user?.email}</Typography>
                        </Box>
                        <Box marginBottom={'8px'}>
                            <Typography variant="h6">Возраст:</Typography>
                            <Typography variant="body1">{user?.age}</Typography>
                        </Box>
                        <Box marginBottom={'8px'}>
                            <Typography variant="h6">Пол:</Typography>
                            <Typography variant="body1">{user?.sex}</Typography>
                        </Box>
                        <Box marginBottom={'8px'}>
                            <Typography variant="h6">Страна:</Typography>
                            <Typography variant="body1">{user?.country}</Typography>
                        </Box>
                        <Box marginBottom={'8px'}>
                            <Typography variant="h6">Обо мне:</Typography>
                            <Typography variant="body1">{user?.aboutYou}</Typography>
                        </Box>
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