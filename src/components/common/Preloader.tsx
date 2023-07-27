import React from 'react'
import preloader from '../../assets/image/preloader.svg'
import {Container, Grid} from '@material-ui/core'
import Box from '@mui/material/Box'

type PreloaderPropsType = {
    mini?: boolean
}

export const Preloader: React.FC<PreloaderPropsType> = ({mini = false}) => {
    return (
        <Container>
            <Grid container
                  style={!mini ? {height: window.innerHeight - 50} : undefined}
                  alignItems={'center'}
                  justifyContent={'center'}
            >
                <Grid container
                      alignItems={'center'}
                      direction={'column'}>
                    <Box>
                        <img style={!mini ? {width: 300} : {width: 120}}
                             src={preloader}
                             alt={'Preloader'}/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}