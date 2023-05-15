import React, {useState} from 'react'
import {Button} from '@material-ui/core'
import TextField from '@mui/material/TextField'
import {addDoc, collection, getFirestore, serverTimestamp} from 'firebase/firestore'

export function AddMessageForm({user}: any) {
    const [value, setValue] = useState('')

    const inputRef = React.useRef<HTMLInputElement>()
    const messagesCollection = collection(getFirestore(), 'messages')

    const ClearMessageHandle = () => {
        setValue('')
        inputRef.current?.focus()
    }

    const keyEnterHandle = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessageHandler()
        }
        return
    }

    const sendMessageHandler = async () => {
        if (!user) return

        if (!value.trim()) {
            ClearMessageHandle()
            return
        }

        if (user) {
            const messageData = {
                message: value,
                userId: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp()
            }
            try {
                const newMessageRef = await addDoc(messagesCollection, messageData)
                console.log('Message sent successfully! ID:', newMessageRef.id)
                setValue('')
                ClearMessageHandle()
            } catch (error) {
                console.error('Error sending message: ', error)
            }
        }
    }

    console.log('RENDER Add message form')
    return (
        <div style={{width: '100%'}}>
            <TextField
                fullWidth
                maxRows={2}
                variant={'outlined'}
                value={value}
                inputRef={inputRef}
                onChange={e => setValue(e.target.value)}
                onKeyDown={keyEnterHandle}/>
            <Button onClick={sendMessageHandler} variant={'outlined'}>Send</Button>
            <Button disabled={!value.length} onClick={ClearMessageHandle} variant={'outlined'}>Clear</Button>
        </div>
    )
}