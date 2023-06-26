import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import {AllQuickBytesType} from '../../../types/types'

type QuickBytesPropsType = {
    qBytesData: AllQuickBytesType[]
}

export const QuickBytes: React.FC<QuickBytesPropsType> = ({qBytesData}) => {
    console.log('Render qB messages')

    return (
        <Card sx={{height: '100%'}}>
            <List>
                {qBytesData.reverse().map((post, index) => (
                    <div key={post.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt={`avatarUserId_${post.userId}`}
                                        src={post?.photoURL || ''}/>
                            </ListItemAvatar>
                            <ListItemText
                                style={{overflow: 'hidden'}}
                                primary={post.displayName}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {post.speak}
                                        </Typography>
                                        {` — ${post.text}`}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        {index !== qBytesData.length - 1 && <Divider variant="inset" component="li"/>}
                    </div>
                ))
                }
            </List>
        </Card>
    )
}