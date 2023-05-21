import React from 'react'
import preloader from '../../assets/image/preloader.svg'
import {Button, Container, Grid} from '@material-ui/core'
import Box from '@mui/material/Box'

export const Preloader: React.FC = () => {
    return (
        <Container>
            <Grid container
                  style={{height: window.innerHeight - 50}}
                  alignItems={'center'}
                  justifyContent={'center'}
            >
                <Grid container
                      alignItems={'center'}
                      direction={'column'}>
                    <Box p={5}>
                        <img style={{width: 300}} src={preloader}/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}