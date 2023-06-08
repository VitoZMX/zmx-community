import React, {ChangeEvent, useContext, useEffect, useState} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {useAuthState} from 'react-firebase-hooks/auth'
import Typography from '@mui/material/Typography'
import ImageSearchIcon from '@mui/icons-material/ImageSearch'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import EditIcon from '@mui/icons-material/Edit'
import imgF from '../assets/image/logoNoImg.png'
import Switch from '@mui/material/Switch'
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
import {collection, getFirestore} from 'firebase/firestore'
import {updateProfile} from 'firebase/auth'
import {Context} from '../App'
import {AlertDialogSlide} from './AlertFullScreen'
import {green} from '@mui/material/colors'

export function SettingPage() {
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const timer = React.useRef<number>()
    const {auth} = useContext(Context)
    const {setUser} = useContext(Context)
    const [user] = useAuthState(auth)
    const [checked, setChecked] = React.useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [showAlert, setShowAlert] = useState(false)
    const inputRef = React.useRef<HTMLInputElement>()
    const usersCollection = collection(getFirestore(), 'users')
    const avatarRequirements = 'Format: .jpg, .jpeg, .png, .gif. Max size: 10Mb'

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
    }

    const PhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
        setLoading(true)

        if (e.target.files && e.target.files.length) {
            let file = e.target.files[0]
            const maxSize = 10 * 1024 * 1024 // 10 МБ в байтах
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']

            if (file.size <= maxSize && allowedTypes.includes(file.type)) {
                const fileExtension = `.${file.name.split('.').pop()}`

                if (allowedExtensions.includes(fileExtension.toLowerCase())) {
                    setSelectedFile(file)
                    console.log('File is valid')
                } else {
                    setShowAlert(true)
                    setLoading(false)
                    console.error('Invalid file extension')
                }
            } else {
                setShowAlert(true)
                setLoading(false)
                console.error('Invalid file size or type')
            }
        }
    }

    useEffect(() => {
        if (selectedFile) {
            sendPhotoSelected()
        }
    }, [selectedFile])

    const sendPhotoSelected = async () => {
        if (!user) return

        if (selectedFile) {
            console.log('start')
            const storage = getStorage()
            const storageRef = ref(storage, `usersAvatar/${user.uid}___${selectedFile.name}`)
            const snapshot = await uploadBytes(storageRef, selectedFile)
            const imgUrl = await getDownloadURL(snapshot.ref)

            if (user.photoURL) {
                let storageRefOldAvatar = null

                try {
                    storageRefOldAvatar = ref(storage, user.photoURL)
                    await deleteObject(storageRefOldAvatar)
                        .then(() => {
                            console.log('File deleted successfully')
                            updatePhotoUser(imgUrl)
                        })
                        .catch((error) => {
                            console.error('Error deleting file:', error)
                            updatePhotoUser(imgUrl)
                        })
                } catch (error) {
                    console.error('Пользователь впервые сменил дефолтную аватарку', error)
                    updatePhotoUser(imgUrl)
                }
                // отправка ссылок на аватарки в новую коллекцию
                /*const userDocRef = doc(firestore, 'users', user.uid)
                await updateDoc(userDocRef, newsData)*/
            } else {
                updatePhotoUser(imgUrl)
            }
        }
        setSelectedFile(null)
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
            setUser(updatedUser)
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
    /*const sendProfileDataHandler = async () => {
        if (!user) return

        /!*if (!valueTitle.trim()) {
            ClearMessageHandle()
            return
        }*!/

        if (user) {
            let imgUrl = ''
            if (selectedFile) {
                const storage = getStorage()
                const storageRef = ref(storage, `ProfilePhoto/${selectedFile.name}`)
                const snapshot = await uploadBytes(storageRef, selectedFile)
                imgUrl = await getDownloadURL(snapshot.ref)
            }
            const newsData = {
                title: valueTitle,
                MinText: valueMinText,
                MaxText: valueMaxText,
                userId: user.uid,
                img: imgUrl,
                createdAt: serverTimestamp()
            }
            try {
                const newMessageRef = await addDoc(newsCollection, newsData)
                console.log('Message sent successfully! ID:', newMessageRef.id)
                setValueTitle('')
                setValueMinText('')
                setValueMaxText('')
                ClearMessageHandle()
                setSelectedFile(null)
                handleClose()
            } catch (error) {
                console.error('Error sending message: ', error)
            }
        }
    }*/

    return (
        <Container style={{marginTop: '80px'}}>
            {showAlert && <AlertDialogSlide text={avatarRequirements} title={'No valid data'}/>}
            {<Grid container spacing={1} alignItems="stretch">
                <Grid item sm={12} lg={4} md={4} xs={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                    }}>
                        <CardMedia
                            sx={{objectFit: 'cover', height: '250px', borderRadius: '12px  12px 0 0 '}}
                            component="img"
                            image={user?.photoURL || imgF}
                            alt="Your avatar"
                        />
                        <div style={{padding: '10px'}}>
                            <Button variant="outlined" component="label"
                                    sx={buttonSx}
                                    disabled={loading}
                                    onClick={handleButtonClick}
                                    style={{marginBottom: '2px', width: '100%'}}>
                                <ImageSearchIcon/>
                                <input type="file"
                                       accept=".jpg,.jpeg,.png,.gif"
                                       name="imgfile"
                                       max="10485760"
                                       onChange={PhotoSelected}
                                       style={{display: 'none'}}
                                />
                                new avatar
                            </Button>
                            <Typography variant="body2" sx={{
                                mr: 2,
                                fontFamily: 'Roboto',
                                fontWeight: 100,
                                marginBottom: '10px',
                            }}>{avatarRequirements}</Typography>
                            <Typography variant="subtitle2" sx={{
                                mr: 2,
                                fontFamily: 'Roboto',
                                fontWeight: 100,
                                color: 'white'
                            }}>Account created: {user?.metadata.creationTime}</Typography>
                            <Typography variant="subtitle2" sx={{
                                mr: 2,
                                fontFamily: 'Roboto',
                                fontWeight: 100,
                                color: 'white'
                            }}>ID: {user?.uid}</Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item sm={12} lg={8} xs={12} md={8}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        height: '100%',
                        padding: '10px'
                    }}>
                        <Typography variant="h4" sx={{
                            mr: 2,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: 'Roboto',
                            fontWeight: 350,
                            color: 'black'
                        }}>{user?.displayName}</Typography>
                        <Typography variant="h5" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'black'
                        }}>{user?.email}</Typography>
                        <Typography variant="h6" sx={{
                            mr: 2,
                            fontFamily: 'Roboto',
                            fontWeight: 100,
                            color: 'black'
                        }}>Dark mode
                            <Switch
                                checked={checked}
                                onChange={handleChange}
                                inputProps={{'aria-label': 'controlled'}}
                                disabled={true}
                            />
                        </Typography>
                        <Button variant="outlined" onClick={() => {
                        }} style={{marginBottom: '10px', width: '100%'}}>
                            <EditIcon/>
                            edit data
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        padding: '10px'
                    }}>
                        <h4>Тут можно удалить свои посты.</h4>
                    </div>
                </Grid>
            </Grid>}
        </Container>
    )
}