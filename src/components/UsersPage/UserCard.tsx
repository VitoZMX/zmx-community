import React, { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import { userType } from '../../types/types'
import { Context, FirebaseUserAndUserType } from '../../App'
import { usersAPI } from '../../api/users-api'
import { Preloader } from '../common/Preloader'
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import {  Paper } from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '12px',
    color: 'black'
  },
  avatar: {
    marginBottom: '8px',
  },
  button: {
    marginLeft: 'auto',
  },
});

type UserCardPropsType = {
  profile: userType;
}

export const UserCard: React.FC<UserCardPropsType> = ({ profile }) => {
  const { user, setUser } = useContext(Context)
  const classes = useStyles()
  const navigate = useNavigate()

  const handleAddFriend = (friendId: string, userId: string | undefined) => {
    if (!userId) {
      return
    }

    usersAPI.addFriend(friendId, userId).then(data =>
      setUser({ ...user, friends: data.friends || [] } as FirebaseUserAndUserType)
    ).then(() => console.log('Adding friend:', friendId))
  }

  const handleDelFriend = (friendId: string, userId: string | undefined) => {
    if (!userId) {
      return
    }

    usersAPI.delFriend(friendId, userId).then(data =>
      setUser({ ...user, friends: data.friends || [] } as FirebaseUserAndUserType)
    ).then(() => console.log('Delete friend:', friendId))
  }

  const handleClickToProfile = (id: string) => {
    navigate(`/profile/${id}`)
  }

  if (!user) {
    return <Preloader/>
  }

  return (
    <Paper style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Button variant="text"
              style={{
                height: '100%',
                width: '100%',
                textTransform: 'none',
                alignItems: 'stretch'
              }}
              className={classes.root}
              onClick={() => {
                handleClickToProfile(`${profile.uid}`)
              }}>
        <Grid item style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          alignContent: 'center',
          flexDirection: 'column',
          flexWrap: 'nowrap'
        }}>
          <Avatar className={classes.avatar}
                  sx={{ width: 95, height: 95 }}
                  alt={profile.uid}
                  src={profile.photoURL || ''}/>
          <Typography variant="body1"
                      style={{
                        wordBreak: 'break-word',
                        width: '100%'
                      }}>
            {profile.displayName}
          </Typography>
        </Grid>
      </Button>
      <Grid item className={classes.root}>
        {user.friends.some((friend) => friend === profile.uid) ?
          (
            <Button variant="outlined" color="secondary" size="small"
                    onClick={() => handleDelFriend(profile.uid, user?.uid)}>
              Delete friend
            </Button>
          )
          :
          (
            <Button variant="outlined" color="primary" size="small"
                    onClick={() => handleAddFriend(profile.uid, user?.uid)}>
              Add friend
            </Button>
          )}
      </Grid>
    </Paper>
  )
}