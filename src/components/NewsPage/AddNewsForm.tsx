import * as React from 'react'
import {ChangeEvent, useContext, useState} from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AddIcon from '@mui/icons-material/Add'
import {addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore'
import {Context} from '../../App'
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'

export function AddNewsForm() {
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const [valueTitle, setValueTitle] = useState('')
    const [valueMinText, setValueMinText] = useState('')
    const [valueMaxText, setValueMaxText] = useState('')
    const {user} = useContext(Context)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const inputRef = React.useRef<HTMLInputElement>()
    const newsCollection = collection(getFirestore(), 'news')

    const ClearMessageHandle = () => {
        setValueTitle('')
        setValueMinText('')
        setValueMaxText('')
        inputRef.current?.focus()
    }

    /*const keyEnterHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendNewsHandler()
        }
        return
    }*/

    const PhotoSelected = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length) {
            setSelectedFile(e.target.files[0])
        }
    }

    const sendNewsHandler = async () => {
        if (!user) return

        if (!valueTitle.trim()) {
            ClearMessageHandle()
            return
        }

        if (user) {
            let imgUrl = ''
            if (selectedFile) {
                const storage = getStorage()
                const storageRef = ref(storage, `news/${selectedFile.name}`)
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
    }

    return (
        <div>
            <Button variant="outlined"
                    onClick={handleClickOpen}
                    style={{marginBottom: '10px'}}>
                <AddIcon/>
                Add news
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>What's new?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Что бы добавить новость на сайт, пожалйста, заполните все поля.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Заголовок новости"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setValueTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="Mintext"
                        label="Коротко опишите новость (НЕОБЯЗАТЕЛЬНО)"
                        type="text"
                        fullWidth
                        multiline
                        rows={2}
                        onChange={e => setValueMinText(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="Maxtext"
                        label="Подробности"
                        type="submit"
                        fullWidth
                        multiline
                        rows={7}
                        onChange={e => setValueMaxText(e.target.value)}
                    />
                    <Button variant="outlined" component="label" style={{marginTop: '10px'}}>
                        Прикрепить файл обложки
                        <input type="file" onChange={PhotoSelected} hidden/>
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={sendNewsHandler}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}