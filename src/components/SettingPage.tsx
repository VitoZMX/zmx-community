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
import {updateProfile, User as FirebaseUser} from 'firebase/auth'
import {Context} from '../App'

export function SettingPage() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    const [profile, setUser] = useState<FirebaseUser | null>(null)
    const [checked, setChecked] = React.useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const firestore = getFirestore()
    const inputRef = React.useRef<HTMLInputElement>()
    const usersCollection = collection(getFirestore(), 'users')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
    }

    const PhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            let file = e.target.files[0]
            setSelectedFile(file)
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
            const storageRef = ref(storage, `usersAvatar/${selectedFile.name}`)
            const snapshot = await uploadBytes(storageRef, selectedFile)
            const imgUrl = await getDownloadURL(snapshot.ref)

            if (user.photoURL) {
                const storageRefOldAvatar = ref(storage, user?.photoURL)

                deleteObject(storageRefOldAvatar)
                    .then(() => {
                        console.log('File deleted successfully')
                    })
                    .catch((error) => {
                        console.error('Error deleting file:', error)
                    })
            }

            // отправка ссылок на аватарки в новую коллекцию
            /*const userDocRef = doc(firestore, 'users', user.uid)
            await updateDoc(userDocRef, newsData)*/

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    photoURL: imgUrl
                })
                const updatedUser = {
                    ...auth.currentUser,
                    photoURL: imgUrl
                }
                setUser(updatedUser)
                console.log('Profile updated!')
            } else {
                setUser(null)
            }
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
            <Grid container spacing={1} alignItems="stretch">
                <Grid item sm={12} md={4}>
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
                            <Button variant="outlined" component="label" style={{marginBottom: '10px', width: '100%'}}>
                                <ImageSearchIcon/>
                                <input type="file" onChange={PhotoSelected} hidden/>
                                new avatar
                            </Button>
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
                <Grid item md={8} sm={12}>
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
            </Grid>
        </Container>
    )
}