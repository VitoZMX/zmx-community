import React, {useContext} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {Context} from '../index'
import {useAuthState} from 'react-firebase-hooks/auth'
import Typography from '@mui/material/Typography'
import ImageSearchIcon from '@mui/icons-material/ImageSearch'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import EditIcon from '@mui/icons-material/Edit'
import imgF from '../assets/image/logoNoImg.png'
import Switch from '@mui/material/Switch'

export function SettingPage() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    const [checked, setChecked] = React.useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
    }

    return (
        <Container style={{marginTop: '80px'}}>
            <Grid container spacing={1} alignItems="stretch">
                <Grid item sm={12} md={4}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                    }}>
                        <CardMedia
                            sx={{objectFit: 'cover', height: '250px', borderRadius: '12px  12px 0 0 '}}
                            component="img"
                            image={user?.photoURL || imgF}
                            alt="Your avatar"
                        />
                        <div style={{padding: '10px'}}>
                            <Button variant="outlined" onClick={() => {
                            }} style={{marginBottom: '10px', width: '100%'}}>
                                <ImageSearchIcon/>
                                new avatar
                            </Button>
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
                    </div>
                </Grid>
                <Grid item md={8} sm={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        height: '100%',
                        padding: '10px'
                    }}>
                        <Typography variant="h4" sx={{
                            mr: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: 'Roboto',
                            fontWeight: 350,
                            color: 'black'
                        }}>{user?.displayName}</Typography>
                        <Typography variant="h5" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'black'
                        }}>{user?.email}</Typography>
                        <Typography variant="h6" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'black'
                        }}>Dark mode
                            <Switch
                                checked={checked}
                                onChange={handleChange}
                                inputProps={{'aria-label': 'controlled'}}
                                disabled={true}
                            />
                        </Typography>
                        <Button variant="outlined" onClick={() => {
                        }} style={{marginBottom: '10px', width: '100%'}}>
                            <EditIcon/>
                            edit data
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        padding: '10px'
                    }}>
                        <h4>Тут можно удалить свои посты.</h4>
                    </div>
                </Grid>
            </Grid>
        </Container>
    )
}