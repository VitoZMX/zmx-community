import React, {useContext} from 'react'
import {Button, makeStyles, Paper} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import {userType} from '../../types/types'
import {Context, FirebaseUserAndUserType} from '../../App'
import {usersAPI} from '../../api/users-api'
import {Preloader} from '../common/Preloader'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    avatar: {
        marginRight: theme.spacing(2),
    },
    button: {
        marginLeft: 'auto',
    },
}))

type UserCardPropsType = {
    profile: userType;
}

export const UserCard: React.FC<UserCardPropsType> = ({profile}) => {
    const {user, setUser} = useContext(Context)
    const classes = useStyles()

    const handleAddFriend = (friendId: string, userId: string) => {
        usersAPI.addFriend(friendId, userId).then(data =>
            setUser({...user, friends: data.friends || []} as FirebaseUserAndUserType)
        ).then(() => console.log('Adding friend:', friendId))
    }

    const handleDelFriend = (friendId: string, userId: string) => {
        usersAPI.delFriend(friendId, userId).then(data =>
            setUser({...user, friends: data.friends || []} as FirebaseUserAndUserType)
        ).then(() => console.log('Delete friend:', friendId))
    }

    if (!user) {
        return <Preloader/>
    }

    return (
        <Paper className={classes.root} style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Grid item>
                <Avatar className={classes.avatar}
                        sx={{width: 58, height: 58}}
                        alt={profile.uid}
                        src={profile.photoURL || ''}/>
            </Grid>
            <Grid item style={{
                display: 'flex',
                wordBreak: 'break-word',
                width: '100%',
                justifyContent: 'flex-start'
            }}>{profile.displayName}</Grid>
            <Grid item className={classes.button}>
                {user.friends.some((friend) => friend === profile.uid) ?
                    (
                        <Button variant="outlined" color="secondary" size="small"
                                onClick={() => handleDelFriend(profile.uid, user.uid)}>
                            Delete friend
                        </Button>
                    )
                    :
                    (
                        <Button variant="outlined" color="primary" size="small"
                                onClick={() => handleAddFriend(profile.uid, user.uid)}>
                            Add friend
                        </Button>
                    )}
            </Grid>
        </Paper>
    )
}