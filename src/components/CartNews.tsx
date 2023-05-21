import React, {useContext} from 'react'
import {Context} from '../index'
import {useAuthState} from 'react-firebase-hooks/auth'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {CardActionArea, useTheme} from '@mui/material'

type CartNewsPropsType = {
    img: string,
    title: string,
    text: string
}

export function CartNews({img, title, text}: CartNewsPropsType) {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    const theme = useTheme()

    return (
        <Card sx={{
            maxWidth: theme.breakpoints.down('sm') ? 'auto' : '345',
            display: 'flex',
            alignItems: 'flex-start',
            height: '100%'
        }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={img}
                    alt="alt"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {text}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}