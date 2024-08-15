import React from 'react'
import preloader from '../../assets/image/preloader.svg'
import Box from '@mui/material/Box'
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

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
                      direction='column'>
                    <Box>
                        <img style={!mini ? {width: 300} : {width: 120}}
                             src={'../../assets/image/preloader.svg'}
                             alt={'Preloader'}/>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}