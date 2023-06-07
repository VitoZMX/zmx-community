import React, {useContext, useEffect, useRef, useState} from 'react'
import {Container, Grid} from '@material-ui/core'
import {useCollection} from 'react-firebase-hooks/firestore'
import {collection, getFirestore, orderBy, query} from 'firebase/firestore'
import {Preloader} from './common/Preloader'
import {Message} from './Message'
import {AddMessageForm} from './AddMessageForm'
import {Context} from '../App'
import {useAuthState} from 'react-firebase-hooks/auth'

type MessageType = {
    id: string;
    photoURL: string;
    displayName: string;
    message: string;
    createdAt: {
        seconds: number;
    } | null;
    userId: string
}

export const Chat: React.FC = () => {
    const {auth, firestore} = useContext(Context)
    const [user] = useAuthState(auth)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [loading, setLoading] = useState<boolean>(true) // добавляем состояние загрузки
    const [isAutoScroll, setIsAutoScroll] = useState(true)
    const messagesAnchorRef = useRef<HTMLDivElement>(null)

    const messagesCollection = collection(getFirestore(), 'messages')
    const queryMessages = query(messagesCollection, orderBy('createdAt'))
    const [messagesSnapshot, error] = useCollection(queryMessages)

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget
        if (Math.abs((element.scrollHeight - element.scrollTop) - element.clientHeight) < 800) {
            !isAutoScroll && setIsAutoScroll(true)
        } else {
            isAutoScroll && setIsAutoScroll(false)
        }
    }

    useEffect(() => {
        if (isAutoScroll) {
            messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
        }
    }, [messages])

    useEffect(() => {
        if (messagesSnapshot) {
            const newMessages = messagesSnapshot.docs.map((doc) => ({
                id: doc.id,
                photoURL: doc.data().photoURL,
                displayName: doc.data().displayName,
                message: doc.data().message,
                createdAt: doc.data().createdAt,
                userId: doc.data().userId,
            }))
            setMessages(newMessages)
            setLoading(false)
        }
    }, [messagesSnapshot])

    console.log('RENDER ALL messages')

    return (
        <Container>
            <Grid
                container
                justifyContent={'center'}
            >
                {loading ? (
                    <Preloader/>
                ) : (
                    <div
                        onScroll={scrollHandler}
                        style={{
                            width: '100%',
                            height: '90vh',
                            border: '1px solid black',
                            overflowY: 'auto'
                        }}
                    >
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                margin: 10,
                                padding: 8,
                                borderRadius: 8,
                                marginLeft: user?.uid === msg.userId ? 'auto' : '10px',
                                marginRight: user?.uid === msg.userId ? '10px' : '12vh',
                                background: user?.uid === msg.userId ? '#ffe5e5' : '#d4b7d5',
                                width: 'fit-content'
                            }}>
                                <Message
                                    idMessage={msg.id}
                                    photoURL={msg.photoURL}
                                    displayName={msg.displayName}
                                    message={msg.message}
                                    seconds={msg.createdAt && msg.createdAt.seconds}
                                />
                                <div ref={messagesAnchorRef}></div>
                            </div>
                        ))}
                    </div>
                )}
                <AddMessageForm user={user}/>
            </Grid>
        </Container>
    )
}