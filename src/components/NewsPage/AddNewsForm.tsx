import * as React from 'react'
import {ChangeEvent, useContext, useState} from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AddIcon from '@mui/icons-material/Add'
import {addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore'
import {Context} from '../../App'
import {permissionsFor} from '../../roles'
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
    const {rolePermissions} = useContext(Context)
    const canCreateNews = Boolean(user && permissionsFor(user.role, rolePermissions).createNews)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)

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
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
            setError('Выберите изображение размером не более 10 МБ.')
            return
        }
        setError('')
        setSelectedFile(file)
    }

    const saveDraft = async () => { if (!user || saving || !valueTitle.trim()) return; setSaving(true); try { await addDoc(newsCollection, {title: valueTitle.trim(), MinText: valueMinText.trim(), MaxText: valueMaxText.trim(), userId: user.uid, authorName: user.displayName || '', authorPhotoURL: user.photoURL || null, img: '', isPublic: false, status: 'draft', firstPublishedAt: null, createdAt: serverTimestamp(), updatedAt: null}); setValueTitle(''); setValueMinText(''); setValueMaxText(''); handleClose() } catch { setError('Не удалось сохранить черновик') } finally { setSaving(false) } }

    const sendNewsHandler = async () => {
        if (!user || saving) return
        setSaving(true)
        setError('')

        if (!valueTitle.trim()) {
            setError('Введите заголовок новости.')
            setSaving(false)
            return
        }

        try {
            let imgUrl = ''
            if (selectedFile) {
                const storage = getStorage()
                const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
                const storageRef = ref(storage, `news/${user.uid}/${Date.now()}-${safeName}`)
                const snapshot = await uploadBytes(storageRef, selectedFile)
                imgUrl = await getDownloadURL(snapshot.ref)
            }
            await addDoc(newsCollection, {
                title: valueTitle.trim(), MinText: valueMinText.trim(), MaxText: valueMaxText.trim(),
                userId: user.uid, authorName: user.displayName || '', authorPhotoURL: user.photoURL || null,
                img: imgUrl, isPublic: true, status: 'published', firstPublishedAt: serverTimestamp(), createdAt: serverTimestamp(), updatedAt: null
            })
            setValueTitle(''); setValueMinText(''); setValueMaxText(''); setSelectedFile(null)
            handleClose()
        } catch (error: any) {
            console.error('Error sending news:', error)
            setError(error?.code === 'storage/quota-exceeded'
                ? 'Хранилище Firebase переполнено. Освободите место или подключите платный тариф Firebase.'
                : 'Не удалось добавить новость. Проверьте настройки Firebase и попробуйте ещё раз.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            {canCreateNews && <Button variant="outlined"
                    onClick={handleClickOpen}
                    style={{marginBottom: '10px'}}>
                <AddIcon/>
                Add news
            </Button>}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>What's new?</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
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
                        <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={PhotoSelected} hidden/>
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveDraft} disabled={saving}>Сохранить черновик</Button><Button onClick={sendNewsHandler} disabled={saving}>{saving ? 'Saving...' : 'Send'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}