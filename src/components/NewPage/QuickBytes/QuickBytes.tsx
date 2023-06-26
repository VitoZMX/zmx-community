import React, {useEffect, useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {collection, getFirestore, limit, orderBy, query} from 'firebase/firestore'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import {profileAPI} from '../../../api/profile-api'
import Card from '@mui/material/Card'
import {quickBytesType, userType} from '../../../types/types'

type AllQuickBytesType = quickBytesType & userType

export const QuickBytes: React.FC = () => {
    const [quickBytes, setQuickBytes] = useState<AllQuickBytesType[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const quickBytesCollection = collection(getFirestore(), 'qBPosts')
    const queryQuickBytesPosts = query(quickBytesCollection, orderBy('createdAt', 'desc'), limit(6))
    const [quickBytesSnapshot] = useCollection(queryQuickBytesPosts)

    useEffect(() => {
        if (quickBytesSnapshot) {
            Promise.all(quickBytesSnapshot.docs.map(async (doc) => {
                const userData = await profileAPI.getProfile(doc.data().userId)
                return {
                    id: doc.id,
                    createdAt: doc.data().createdAt,
                    text: doc.data().text,
                    uid: doc.data().userId,
                    userId: doc.data().userId,
                    speak: doc.data().speak || 'Говорит',
                    displayName: userData.displayName || '',
                    photoURL: userData.photoURL || null,
                    friends: doc.data().friends
                }
            })).then((quickBytes) => {
                setQuickBytes(quickBytes)
                setLoading(false)
                console.log(quickBytes)
            })
        }
    }, [quickBytesSnapshot])

    console.log('Render qB messages')

    return (
        <Card sx={{height: '100%'}}>
            <List>
                {quickBytes.reverse().map((post, index) => (
                    <div>
                        <ListItem key={post.id} alignItems="flex-start">
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
                        {index !== quickBytes.length - 1 && <Divider variant="inset" component="li"/>}
                    </div>
                ))
                }
            </List>
        </Card>
    )
}