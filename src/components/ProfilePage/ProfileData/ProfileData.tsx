import React, {useState} from 'react'
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
import {addDoc, collection, doc, getFirestore, orderBy, query, serverTimestamp} from 'firebase/firestore'
import {useCollection} from 'react-firebase-hooks/firestore'
import {FormControl, InputLabel, MenuItem} from '@mui/material'
import Select from '@mui/material/Select'
import {quickBytesType} from '../../../types/types'
import {Preloader} from '../../common/Preloader'
import {FriendsAvatarGroup} from './FriendsAvatarGroup/FriendsAvatarGroup'

export type PathParamsType = {
    userID?: string
}

export function ProfileData({user, autor = false}: any) {
    const [value, setValue] = useState('')
    const [valueSpeaks, setValueSpeaks] = useState('Говорит')
    const [qBPostsUser, setqBPostsUser] = useState<quickBytesType[]>([])
    const inputRef = React.useRef<HTMLInputElement>()
    const qBPostsCollection = collection(getFirestore(), 'qBPosts')
    const qBPostsCollectionProfile = collection(getFirestore(), 'quickBytesIdCollection')
    const queryqBPostsProfile = query(qBPostsCollectionProfile, orderBy('createdAt'))
    const [queryqBPostsProfileSnapshot, error] = useCollection(queryqBPostsProfile)

    let arr = [
        {
            uid: 'id_123',
            idQB: 'idQB',
            text: '123',
            createData: '123'
        },
        {
            uid: 'id_123',
            idQB: 'idQB',
            text: 'Много длинных букв в тексте! Много длинных букв в тексте! Много длинных букв в тексте! Много длинных букв в тексте! Много длинных букв в тексте! ',
            createData: '123'
        },
        {
            uid: 'id_123',
            idQB: 'idQB',
            text: '123',
            createData: '123'
        },
        {
            uid: 'id_123',
            idQB: 'idQB',
            text: '123',
            createData: '123'
        },
    ]

    const ClearqBTextHandle = () => {
        setValue('')
        inputRef.current?.focus()
    }

    const keyEnterHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendqBTextHandler()
        }
        return
    }

    const sendqBTextHandler = async () => {
        if (!user) return

        if (!value.trim()) {
            ClearqBTextHandle()
            return
        }

        if (user) {
            const qBData = {
                text: value,
                userId: user.uid,
                speak: valueSpeaks,
                createdAt: serverTimestamp(),
            }
            try {
                const newquickBytesRef = await addDoc(qBPostsCollection, qBData)
                const quickBytesId = newquickBytesRef.id
                const userDocRef = doc(getFirestore(), 'users', user.uid)
                await addDoc(collection(userDocRef, 'quickBytesIdCollection'), {quickBytesId})
                console.log('qB Post successfully!')

                setValue('')
                ClearqBTextHandle()
            } catch (error) {
                console.error('Error adding document: ', error)
            }
        }
    }

    if (!user) {
        return <Preloader/>
    }

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
                        image={user?.photoURL || imgF}
                        alt="Your avatar"
                    />
                    <div style={{padding: '10px'}}>
                        <Typography variant="body1">Роль: {user?.role}</Typography>
                        <Typography style={{}}
                                    variant="body1">Друзей: {user.friends?.length || '0'}</Typography>
                        <FriendsAvatarGroup autor={autor} friends={user.friends}/>
                        <Typography variant="subtitle2" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'white'
                        }}>Account created: {user?.metadata?.creationTime}</Typography>
                        <Typography variant="subtitle2" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'white'
                        }}>ID: {user?.uid}</Typography>
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
                    }}>{user?.displayName}</Typography>
                    <Box marginBottom={'8px'} key={'user.email'}>
                        <Typography variant="h6">Email:</Typography>
                        <Typography variant="body1">{user?.email}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.age'}>
                        <Typography variant="h6">Возраст:</Typography>
                        <Typography variant="body1">{user?.age}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.sex'}>
                        <Typography variant="h6">Пол:</Typography>
                        <Typography variant="body1">{user?.sex}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.country'}>
                        <Typography variant="h6">Страна:</Typography>
                        <Typography variant="body1">{user?.country}</Typography>
                    </Box>
                    <Box marginBottom={'8px'} key={'user.aboutYou'}>
                        <Typography variant="h6">Обо мне:</Typography>
                        <Typography variant="body1">{user?.aboutYou}</Typography>
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
                        делиться своими мыслями и идеями в ограниченном формате. Следите за последними новостями и
                        трендами, получайте мгновенную обратную связь и оставайтесь в курсе событий в режиме реального
                        времени!" arrow><HelpOutlineIcon/></Tooltip>
                    </div>
                    <div>
                        {arr.map((post, index) => (
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
                                {autor && (
                                    <IconButton type="button" sx={{p: '10px'}} aria-label="delQBtext">
                                        <DeleteForeverIcon/>
                                    </IconButton>
                                )}
                            </div>
                        ))
                        }
                    </div>
                    {autor && (
                        <div style={{width: '100%'}}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                variant={'outlined'}
                                value={value}
                                inputRef={inputRef}
                                onChange={e => setValue(e.target.value)}
                                onKeyDown={keyEnterHandle}/>
                            <div style={{display: 'flex', alignItems: 'center', marginTop: '4px'}}>
                                <Button style={{marginRight: '4px', height: '40px'}} disabled={!value.length}
                                        onClick={ClearqBTextHandle}
                                        variant={'outlined'}>Clear</Button>
                                <Button style={{marginRight: '4px', height: '40px'}} onClick={sendqBTextHandler}
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