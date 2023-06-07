import React, {useContext} from 'react'
import s from './Login.module.css'
import {Button, Container, Grid} from '@material-ui/core'
import { Context } from '../App'
import {
    AuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    TwitterAuthProvider
} from 'firebase/auth'
import GoogleIcon from '@mui/icons-material/Google'
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import AppleIcon from '@mui/icons-material/Apple'
import WindowIcon from '@mui/icons-material/Window'
import Stack from '@mui/material/Stack'

export function Login() {
    const {auth} = useContext(Context)
    const googleProvider = new GoogleAuthProvider()
    const githubProvider = new GithubAuthProvider()
    const twitterProvider = new TwitterAuthProvider()
    const facebookProvider = new FacebookAuthProvider()
    const microsoftProvider = new OAuthProvider('microsoft.com')
    microsoftProvider.setCustomParameters({
        prompt: 'consent',
        login_hint: 'email'
    })
    facebookProvider.setCustomParameters({
        'display': 'popup'
    })

    const login = async (provider: AuthProvider) => {
        try {
            const result = await signInWithPopup(auth, provider)
            console.log(result.user)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Container>
            <Grid container
                  style={{marginTop: '75px'}}
                  alignItems={'center'}
                  justifyContent={'center'}
            >
                <Grid style={{background: 'lightgray', borderRadius: '20px'}}
                      container
                      alignItems={'center'}
                      direction={'column'}>
                    <Stack direction="column" spacing={2} style={{margin: '40px'}}>
                        <Button className={s.loginButton}
                                startIcon={<GoogleIcon/>}
                                onClick={() => login(googleProvider)}
                                variant={'outlined'}>Login with GOOGLE</Button>
                        <Button className={s.loginButton}
                                disabled={true}
                                startIcon={<AppleIcon/>}
                                onClick={() => {}}
                                variant={'outlined'}>Login with APPLE</Button>
                        <Button className={s.loginButton}
                                startIcon={<TwitterIcon/>}
                                onClick={() => login(twitterProvider)}
                                variant={'outlined'}>Login with Twitter</Button>
                        <Button className={s.loginButton}
                                startIcon={<GitHubIcon/>}
                                onClick={() => login(githubProvider)}
                                variant={'outlined'}>Login with GitHub</Button>
                        <Button className={s.loginButton}
                                startIcon={<FacebookIcon/>}
                                onClick={() => login(facebookProvider)}
                                variant={'outlined'}>Login with Facebook</Button>
                        <Button className={s.loginButton}
                                startIcon={<WindowIcon/>}
                                onClick={() => login(microsoftProvider)}
                                variant={'outlined'}>Login with Microsoft</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    )
}