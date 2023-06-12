import React, {ChangeEvent, useContext, useEffect, useState} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ImageSearchIcon from '@mui/icons-material/ImageSearch'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import imgF from '../assets/image/logoNoImg.png'
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'
import {collection, doc, getDoc, getFirestore, setDoc, updateDoc} from 'firebase/firestore'
import {updateProfile} from 'firebase/auth'
import {Context} from '../App'
import {AlertDialogSlide} from './AlertFullScreen'
import {green} from '@mui/material/colors'
import {EditDataProfile} from './EditDataProfile'

export function SettingPage() {
    const [loading, setLoading] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const timer = React.useRef<number>()
    const {user} = useContext(Context)
    const {auth} = useContext(Context)
    const {setUser} = useContext(Context)
    const [checked, setChecked] = React.useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [showAlert, setShowAlert] = useState(false)
    const inputRef = React.useRef<HTMLInputElement>()
    const usersCollection = collection(getFirestore(), 'users')
    const avatarRequirements = 'Format: .jpg, .jpeg, .png, .gif. Max size: 10Mb'
    const [isEditing, setIsEditing] = useState(false)

    const handleToggleEditing = () => {
        setIsEditing(!isEditing)
    }

    const handleSave = () => {
        //onSave(textValue);
        setIsEditing(false)
    }

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
        if (!user) return
        if (auth.currentUser) {
            const newUserData = {
                photoURL: imgUrl
            }
            const userDocRef = doc(getFirestore(), 'users', user?.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
                await updateDoc(userDocRef, newUserData)
            } else {
                const userBasRef = doc(getFirestore(), 'users', user.uid)
                await setDoc(userBasRef, newUserData)
            }

            await updateProfile(auth.currentUser, {
                photoURL: imgUrl,
            })
            const updatedUser = {
                ...user,
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

    return (
        <Container style={{marginTop: '80px'}}>
            {showAlert && <AlertDialogSlide text={avatarRequirements} title={'No valid data'}/>}
            {<Grid container spacing={1} alignItems="stretch">
                <Grid item sm={12} lg={4} md={4} xs={12}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        height: '100%',
                    }}>
                        <CardMedia
                            sx={{
                                objectFit: 'cover',
                                minHeight: '250px',
                                maxHeight: '400px',
                                borderRadius: '12px  12px 0 0 '
                            }}
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
                <Grid item sm={12} lg={8} xs={12} md={8}>
                    <div style={{
                        backgroundColor: 'rgba(25,118,210,0.2)',
                        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        height: '100%',
                        padding: '10px'
                    }}>
                        <EditDataProfile/>
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