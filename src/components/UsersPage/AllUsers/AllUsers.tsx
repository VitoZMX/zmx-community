import React, {useContext, useEffect, useState} from 'react'
import {Box} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import {userType} from '../../../types/types'
import {Context} from '../../../App'
import Typography from '@mui/material/Typography'
import {UserCard} from '../UserCard'

type allUsersPropsType = {
    allUsers: userType[];
}

export const AllUsers: React.FC<allUsersPropsType> = ({allUsers}) => {
    const {user} = useContext(Context)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(0)
    const pageCount = Math.ceil(allUsers.length / pageSize)

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }
    useEffect(() => {
        setPageSize(5)
    }, [])

    return (
        <Grid container spacing={1} sx={{direction: 'row', justifyContent: 'flex-start', alignItems: 'stretch'}}>
            <Box style={{width: '100%', flexGrow: '1', marginLeft: '8px'}}>
                <Typography variant="body1">Всего пользователей: {allUsers.length}</Typography>
            </Box>
            {allUsers.slice((page - 1) * pageSize, page * pageSize).map((profile) => (
                profile.uid === user?.uid ? null : (
                    <Grid item xs={6} sm={4} md={2} key={profile.uid}>
                        <UserCard profile={profile}/>
                    </Grid>
                )
            ))}
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