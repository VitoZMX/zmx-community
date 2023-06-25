import React, {useContext, useEffect, useState} from 'react'
import {Box} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import {Context} from '../../../App'
import Typography from '@mui/material/Typography'
import {UserCard} from '../UserCard'

export const UserFriend: React.FC = () => {
    const {user, userFriends} = useContext(Context)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const pageCount = Math.ceil(userFriends.length / pageSize)

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    useEffect(() => {
        setPageSize(5)
    }, [])

    return (
        <Grid container spacing={1} sx={{direction: 'row', justifyContent: 'flex-start', alignItems: 'stretch'}}>
            <Box style={{width: '100%', flexGrow: '1', marginLeft: '8px'}}>
                <Typography variant="body1">Всего друзей: {user?.friends.length}</Typography>
            </Box>
            {userFriends.length == 0 && <div style={{marginLeft: '8px'}}>Список друзей пуст!</div>}
            {userFriends.slice((page - 1) * pageSize, page * pageSize).map((profile) => (
                    <Grid item xs={6} sm={4} md={2} key={profile.uid}>
                        <UserCard profile={profile}/>
                    </Grid>
                )
            )
            }
            <Pagination variant="outlined" shape="rounded" color="primary"
                        style={{
                            marginTop: '20px',
                            width: '100%', flexGrow: '1',
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                        count={pageCount}
                        page={page}
                        onChange={handleChange}/>
        </Grid>
    )
}