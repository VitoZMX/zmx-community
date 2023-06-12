import React, {useContext, useState} from 'react'
import Typography from '@mui/material/Typography'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import Switch from '@mui/material/Switch'
import {collection, doc, getDoc, getFirestore, setDoc, updateDoc} from 'firebase/firestore'
import {updateProfile} from 'firebase/auth'
import {Context, FirebaseUserAndUserType} from '../App'
import {AlertDialogSlide} from './AlertFullScreen'
import {green} from '@mui/material/colors'
import TextField from '@mui/material/TextField'
import {FormControl, InputLabel, MenuItem} from '@mui/material'
import Select from '@mui/material/Select'
import {Box} from '@material-ui/core'

const ageList = Array.from({length: 91}, (_, i) => i + 9)

export function EditDataProfile() {
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const timer = React.useRef<number>()
    const {auth} = useContext(Context)
    const {user, setUser} = useContext(Context)
    const [checked, setChecked] = React.useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const inputRef = React.useRef<HTMLInputElement>()
    const usersCollection = collection(getFirestore(), 'users')
    const [isEditing, setIsEditing] = useState(false)
    const [textValue, setTextValue] = useState('value')

    const [valueUserDisplayName, setUserDisplayName] = useState(user?.displayName)
    const [valueUserEmail, setUserEmail] = useState(user?.email)
    const [valueUserAge, setUserAge] = useState(user?.age)
    const [valueUserSex, setUserSex] = useState(user?.sex)
    const [valueUserCountry, setUserCountry] = useState(user?.country)
    const [valueTextAboutYou, setTextAboutYou] = useState(user?.aboutYou)
    const [valueDarkMode, setDarkMode] = useState(false)

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            color: green[100],
            borderColor: green[200],
            '&:hover': {
                bgcolor: green[700],
                color: green[100],
                borderColor: green[200],
            },
        }),
    }

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current)
        }
    }, [])

    const handleButtonClick = () => {
        if (!loading) {
            setSuccess(false)
        }
    }

    const handleToggleEditing = () => {
        setIsEditing(!isEditing)
    }

    const handleSave = async () => {
        if (!user) return

        const newUserData = {
            uid: user.uid,
            displayName: valueUserDisplayName,
            email: valueUserEmail,
            age: valueUserAge,
            sex: valueUserSex,
            country: valueUserCountry,
            aboutYou: valueTextAboutYou,
            barkMode: valueDarkMode,
        }

        if (user) {
            const userDocRef = doc(getFirestore(), 'users', user.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
                await updateDoc(userDocRef, newUserData)
            } else {
                const userBasRef = doc(getFirestore(), 'users', user.uid)
                await setDoc(userBasRef, newUserData)
            }

            try {
                const newData = {...user, ...auth, ...newUserData}
                setUser(newData as FirebaseUserAndUserType)
                console.log('Profile updated!')
            } catch (error) {
                console.error('Error update profile data: ', error)
            }
        }
        setIsEditing(false)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
    }

    const updatePhotoUser = async (imgUrl: string | null) => {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                photoURL: imgUrl,
            })
            const updatedUser = {
                ...auth.currentUser,
                photoURL: imgUrl,
            }
            setLoading(false)
            setSuccess(true)
            timer.current = window.setTimeout(() => {
                setSuccess(false)
                setLoading(false)
            }, 4000)
            console.log('Profile updated!')
        } else {
            setUser(null)
        }
    }

    return (
        <div>
            {showAlert && <AlertDialogSlide text={''} title={'No valid data'}/>}
            {isEditing ? (
                <div>
                    <TextField
                        style={{margin: '15px 0 12px 0'}}
                        label={'User name'}
                        value={valueUserDisplayName}
                        onChange={e => setUserDisplayName(e.target.value)}
                        multiline
                        fullWidth
                    />
                    <TextField
                        style={{marginBottom: '12px'}}
                        label={'Email'}
                        value={valueUserEmail}
                        onChange={e => setUserEmail(e.target.value)}
                        multiline
                        fullWidth
                    />
                    <FormControl fullWidth style={{marginBottom: '12px'}}>
                        <InputLabel id="simple-select-age">Age</InputLabel>
                        <Select
                            labelId="simple-select-age"
                            id="simple-select"
                            value={valueUserAge}
                            label="Age"
                            onChange={e => setUserAge(e.target.value)}
                        >
                            {ageList.map((age) => (
                                <MenuItem value={age} key={age}>
                                    {age}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '12px'}}>
                        <InputLabel id="demo-simple-select-country">Country</InputLabel>
                        <Select
                            labelId="demo-simple-select-country"
                            id="demo-simple-select"
                            value={valueUserCountry}
                            label="Сountry"
                            onChange={e => setUserCountry(e.target.value)}
                        >
                            <MenuItem value={'Беларусь'}>Беларусь</MenuItem>
                            <MenuItem value={'Россия'}>Россия</MenuItem>
                            <MenuItem value={'Другое...'}>Другое...</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '12px'}}>
                        <InputLabel id="demo-simple-select-sex">Sex</InputLabel>
                        <Select
                            labelId="demo-simple-select-sex"
                            id="demo-simple-select"
                            value={valueUserSex}
                            label="Сountry"
                            onChange={e => setUserSex(e.target.value)}
                        >
                            <MenuItem value={'Парень'}>Парень</MenuItem>
                            <MenuItem value={'Девушка'}>Девушка</MenuItem>
                            <MenuItem value={'Скрыт'}>Скрыть</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        style={{marginBottom: '12px'}}
                        label={'About you'}
                        value={valueTextAboutYou}
                        onChange={e => setTextAboutYou(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <Typography variant="h6" sx={{
                        mr: 2,
                        fontFamily: 'Roboto',
                        fontWeight: 100,
                        color: 'black'
                    }}>Dark mode
                        <Switch
                            checked={valueDarkMode}
                            onChange={e => setDarkMode(checked)}
                            inputProps={{'aria-label': 'controlled'}}
                            disabled={false}
                        />
                    </Typography>
                </div>
            ) : (
                <div>
                    <Typography variant="h4" sx={{
                        mr: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        fontFamily: 'Roboto',
                        fontWeight: 350,
                        color: 'black'
                    }}>{user?.displayName}</Typography>
                    <Box marginBottom={'8px'}>
                        <Typography variant="h6">Email:</Typography>
                        <Typography variant="body1">{user?.email}</Typography>
                    </Box>
                    <Box marginBottom={'8px'}>
                        <Typography variant="h6">Возраст:</Typography>
                        <Typography variant="body1">{user?.age}</Typography>
                    </Box>
                    <Box marginBottom={'8px'}>
                        <Typography variant="h6">Пол:</Typography>
                        <Typography variant="body1">{user?.sex}</Typography>
                    </Box>
                    <Box marginBottom={'8px'}>
                        <Typography variant="h6">Страна:</Typography>
                        <Typography variant="body1">{user?.country}</Typography>
                    </Box>
                    <Box marginBottom={'8px'}>
                        <Typography variant="h6">Обо мне:</Typography>
                        <Typography variant="body1">{user?.aboutYou}</Typography>
                    </Box>
                    <Typography variant="h6" sx={{
                        mr: 2,
                        fontFamily: 'Roboto',
                        fontWeight: 100,
                        color: 'black'
                    }}>Dark mode
                        <Switch
                            checked={checked}
                            // onChange={handleChange}
                            inputProps={{'aria-label': 'controlled'}}
                            disabled={true}
                        />
                    </Typography>
                </div>
            )}
            {isEditing ? (
                <div>
                    <Button variant="outlined" onClick={() => {
                        setIsEditing(false)
                    }}
                            style={{margin: '10px'}}>
                        <CancelIcon style={{marginRight: '7px'}}/>
                        CANCEL
                    </Button>
                    <Button variant="outlined" onClick={handleSave}
                            style={{margin: '10px'}}>
                        <SaveIcon style={{marginRight: '7px'}}/>
                        SAVE
                    </Button>
                </div>
            ) : (
                <Button variant="outlined" onClick={handleToggleEditing}
                        style={{margin: '10px 0 10px 0', width: '100%'}}>
                    <EditIcon style={{marginRight: '7px'}}/>
                    edit data
                </Button>
            )}
        </div>
    )
}
