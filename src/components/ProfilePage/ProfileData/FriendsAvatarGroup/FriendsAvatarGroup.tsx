import React, {useEffect, useState} from 'react'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import {usersAPI} from '../../../../api/users-api'
import {userType} from '../../../../types/types'
import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'

type FriendsAvatarGroupPropsType = {
    friends: string[],
    autor: boolean
}

export const FriendsAvatarGroup: React.FC<FriendsAvatarGroupPropsType> = ({friends, autor}) => {
    const [groupFriends, setGroupFriends] = useState<userType[]>([])
    const countRenderAvatarFriends = 5
    const navigate = useNavigate()

    useEffect(() => {
        usersAPI.getUsersByIds(friends.slice(0, countRenderAvatarFriends))
            .then(result => setGroupFriends(result))
    }, [friends])

    const handleClickToUsersPage = () => {
        if (!autor) return
        navigate('/users', {state: 1})
    }

    return (
        <Button
            style={{
                height: '100%',
                width: '100%',
                textTransform: 'none',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                paddingLeft: '0',
                marginBottom: '10px'
            }}
            onClick={handleClickToUsersPage}>
            <AvatarGroup max={countRenderAvatarFriends + 1} total={friends.length || 0}>
                {groupFriends.map((profile) => <Avatar alt={profile.displayName} src={profile.photoURL || ''}/>)}
            </AvatarGroup>
        </Button>
    )
}