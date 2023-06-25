import React from 'react'
import {Grid} from '@material-ui/core'
import {Avatar} from '@mui/material'
import {MessageTypeProps} from '../types/types'

export const Message: React.FC<MessageTypeProps> = React.memo((props) => {

    function formatTime(seconds: number) {
        const date = new Date((seconds + 10800) * 1000)
        const hours = date.getUTCHours().toString().padStart(2, '0')
        const minutes = date.getUTCMinutes().toString().padStart(2, '0')
        const secondsR = date.getUTCSeconds().toString().padStart(2, '0')
        return `${hours}:${minutes}:${secondsR}`
    }

    console.log('RENDER 1 message')
    return (
        <div>
            <Grid container>
                <Avatar src={props.photoURL} alt={props.displayName}/>
                <div>{props.displayName}</div>
            </Grid>
            <div>{props.message}</div>
            {props.seconds ? (
                <div>{formatTime(props.seconds)}</div>
            ) : (
                <div>'Now'</div>
            )}
        </div>
    )
})