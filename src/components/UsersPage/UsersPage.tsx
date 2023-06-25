import React, {useContext, useEffect, useState} from 'react'
import {Container} from '@material-ui/core'
import {Context} from '../../App'
import {usersAPI} from '../../api/users-api'
import {userType} from '../../types/types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {AllUsers} from './AllUsers/AllUsers'
import {UserFriend} from './UserFriends/UserFriend'
import {accessibilityProps, TabPanel} from './TabPanel & accessibilityProps/TabPanel & accessibilityProps'
import {Preloader} from '../common/Preloader'

export const UsersPage: React.FC = () => {
    const {user, setUserFriends} = useContext(Context)
    const [allUsers, setAllUsers] = useState<userType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [value, setValue] = React.useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    useEffect(() => {
        if (!user) {
            return
        }
        usersAPI.getUsersByIds(user.friends)
            .then(result => setUserFriends(result))
            .then(() => setLoading(false))
    }, [user])

    useEffect(() => {
        if (!user) {
            return
        }
        usersAPI.getAllUsers().then(data =>
            setAllUsers(data)
        )
    }, [])

    if (loading) {
        return <Preloader/>
    }

    return (
        <Container style={{marginTop: '55px', marginBottom: '55px'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{padding: '0'}} label="All users" {...accessibilityProps(0)} />
                    <Tab label="My friend" {...accessibilityProps(1)} />
                    <Tab label="Search user" {...accessibilityProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <AllUsers allUsers={allUsers}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <UserFriend/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Typography>Содержимое вкладки в разработке!</Typography>
            </TabPanel>
        </Container>
    )
}