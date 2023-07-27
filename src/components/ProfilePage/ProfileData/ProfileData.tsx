import React, {useContext, useEffect, useState} from 'react'
import {Box, Tooltip} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardMedia from '@mui/material/CardMedia'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import imgF from '../../../assets/image/logoNoImg.png'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import {serverTimestamp} from 'firebase/firestore'
import {FormControl, InputLabel, MenuItem} from '@mui/material'
import Select from '@mui/material/Select'
import {quickBytesType} from '../../../types/types'
import {FriendsAvatarGroup} from './FriendsAvatarGroup/FriendsAvatarGroup'
import {profileAPI} from '../../../api/profile-api'
import {quickBytesAPI} from '../../../api/quickBytes-api'
import {Context, FirebaseUserAndUserType} from '../../../App'

export function ProfileData({profile, author = false}: any) {
    const {user, setUser} = useContext(Context)
    const [value, setValue] = useState('')
    const [valueSpeaks, setValueSpeaks] = useState('Говорит')
    const [qBPostsUser, setqBPostsUser] = useState<quickBytesType[]>([])
    const inputRef = React.useRef<HTMLInputElement>()

    const ClearQBTextHandle = () => {
        setValue('')
        inputRef.current?.focus()
    }

    const delQBPostHandler = async (idPost: string) => {
        if (!user) return

        profileAPI.delQBPost(idPost, user.uid).then((data) => {
                setUser({...user, qBPostsId: data.qBPostsId || []} as FirebaseUserAndUserType)
                console.log('Del qB Post successfully!')
            }
        ).then(() => quickBytesAPI.delQuickBytes(idPost))
    }

    const keyEnterHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendQBTextHandler()
        }
        return
    }

    const sendQBTextHandler = async () => {
        if (!user) return

        if (!value.trim()) {
            ClearQBTextHandle()
            return
        }

        const qBData = {
            text: value,
            userId: user.uid,
            speak: valueSpeaks,
            createdAt: serverTimestamp(),
        }

        quickBytesAPI.addQuickBytes(qBData).then(postId => {
            profileAPI.addQBPost(postId, user.uid).then((data) => {
                console.log('Add qB Post successfully!')
                setUser({...user, qBPostsId: data.qBPostsId || []} as FirebaseUserAndUserType)
                setValue('')
                ClearQBTextHandle()
            })
        })
    }

    useEffect(() => {
        if (profile.qBPostsId && profile.qBPostsId.length > 0) {
            quickBytesAPI.getQuickBytesByIds(profile.qBPostsId)
                .then((PostsUser) => {
                    PostsUser.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
                    setqBPostsUser(PostsUser.slice(-7))
                })
        } else {
            setqBPostsUser([])
        }
    }, [profile.qBPostsId])

    return (
        <Grid container spacing={1} alignItems="stretch">
            <Grid item sm={12} lg={4} md={4} xs={12}>
                <div style={{
                    backgroundColor: 'rgba(25,118,210,0.2)',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    height: '100%',
                }}>
                    <CardMedia
                        sx={{
                            objectFit: 'cover', minHeight: '250px',
                            maxHeight: '400px', borderRadius: '12px  12px 0 0 '
                        }}
                        component="img"
                        image={profile?.photoURL || imgF}
                        alt="Your avatar"
                    />
                    <div style={{padding: '10px'}}>
                        <Typography variant="body1">Роль: {profile?.role}</Typography>
                        <Typography style={{}}
                                    variant="body1">Друзей: {profile.friends?.length || '0'}</Typography>
                        <FriendsAvatarGroup author={author} friends={profile.friends}/>
                        <Typography variant="subtitle2" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'white'
                        }}>Account created: {profile?.metadata?.creationTime}</Typography>
                        <Typography variant="subtitle2" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'white'
                        }}>ID: {profile?.uid}</Typography>
                    </div>
                </div>
            </Grid>
            <Grid item sm={12} lg={8} md={8} xs={12}>
                <div style={{
                    backgroundColor: 'rgba(25,118,210,0.2)',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    padding: '15px',
                    height: '100%',
                    width: '100%'
                }}>
                    <Typography variant="h4" sx={{
                        mr: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        fontFamily: 'Roboto',
                        fontWeight: 350,
                        color: 'black'
                    }}>{profile?.displayName}</Typography>
                    <Box marginBottom={'8px'} key={'user.email'}>
                        <Typography variant="h6">Email:</Typography>
                        <Typography variant="body1">{profile?.email}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.age'}>
                        <Typography variant="h6">Возраст:</Typography>
                        <Typography variant="body1">{profile?.age}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.sex'}>
                        <Typography variant="h6">Пол:</Typography>
                        <Typography variant="body1">{profile?.sex}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.country'}>
                        <Typography variant="h6">Страна:</Typography>
                        <Typography variant="body1">{profile?.country}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.aboutYou'}>
                        <Typography variant="h6">Обо мне:</Typography>
                        <Typography variant="body1">{profile?.aboutYou}</Typography>
                    </Box>
                </div>
            </Grid>
            <Grid item md={8} sm={12}>
                <div style={{
                    backgroundColor: 'rgba(25,118,210,0.2)',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    padding: '15px'
                }}>
                    <h4>Блок для добавление новости. xs=12 Блок для добавление новости. xs=12Блок для добавление
                        новости. xs=12Блок для добавление новости. xs=12Блок для добавление новости. xs=12Блок для
                        добавление новости. xs=12Блок для добавление новости. xs=12Блок для добавление новости.
                        xs=12Блок для добавление новости. xs=12Блок для добавление новости. xs=12</h4>
                </div>
            </Grid>
            <Grid item sm={12} lg={4} md={4} xs={12}>
                <div style={{
                    backgroundColor: 'rgba(25,118,210,0.2)',
                    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    padding: '15px'
                }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography marginRight={'4px'} variant="h6">quickBytes</Typography>
                        <Tooltip title="QuickBytes - блок быстрых новостей и мыслей, где пользователи могут
                        делиться своими мыслями и идеями в ограниченном формате (Максимум 200 символов).
                        Следите за последними новостями и трендами, получайте мгновенную обратную связь
                        и оставайтесь в курсе событий в режиме реального времени!" arrow><HelpOutlineIcon/></Tooltip>
                    </div>
                    <div>
                        {qBPostsUser.length === 0 &&
                            <Typography variant="body1">Добавь свой первый qB post!</Typography>}
                        {qBPostsUser.map((post, index) => (
                            <div style={{
                                background: 'rgba(25, 118, 210, 0.18)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: '100%',
                                marginBottom: '4px',
                                borderRadius: '4px',
                                padding: '4px',
                            }} key={`qBPost_${index}`}>
                                <Typography variant="body1">{post.text}</Typography>
                                {author && (
                                    <IconButton
                                        onClick={() => {
                                            delQBPostHandler(post.id)
                                        }}
                                        type="button" sx={{p: '10px'}} aria-label="delQBtext">
                                        <DeleteForeverIcon/>
                                    </IconButton>
                                )}
                            </div>
                        ))
                        }
                    </div>
                    {author && (
                        <div style={{width: '100%', marginTop: '15px'}}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                variant={'outlined'}
                                value={value}
                                inputRef={inputRef}
                                inputProps={{maxLength: 200}}
                                label="Напиши свой qB"
                                onChange={e => setValue(e.target.value)}
                                onKeyDown={keyEnterHandle}/>
                            <div style={{display: 'flex', alignItems: 'center', marginTop: '4px'}}>
                                <Button style={{marginRight: '4px', height: '40px'}} disabled={!value.length}
                                        onClick={ClearQBTextHandle}
                                        variant={'outlined'}>Clear</Button>
                                <Button style={{marginRight: '4px', height: '40px'}} onClick={sendQBTextHandler}
                                        variant={'outlined'}>Send</Button>
                                <FormControl sx={{m: 1, width: '100%'}} size="small">
                                    <InputLabel id="demo-simple-select-speaks">How to say</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-speaks"
                                        id="demo-simple-select"
                                        value={valueSpeaks}
                                        label="How to say"
                                        onChange={e => setValueSpeaks(e.target.value)}
                                    >
                                        <MenuItem value={'Говорит'}>Сказать</MenuItem>
                                        <MenuItem value={'Кричит'}>Крикнуть</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    )}
                </div>
            </Grid>
        </Grid>
    )
}