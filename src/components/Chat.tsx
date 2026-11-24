import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react'
import {useCollection} from 'react-firebase-hooks/firestore'
import {collection, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, doc} from 'firebase/firestore'
import {Alert, Box, Container, Paper, Skeleton, Typography} from '@mui/material'
import {Message} from './Message'
import {AddMessageForm} from './AddMessageForm'
import {Context} from '../App'
import {useAuthState} from 'react-firebase-hooks/auth'
import {ChatMessageType} from '../types/types'

const EDIT_WINDOW_SECONDS = 5 * 60
export const Chat: React.FC = () => {
    const {auth, firestore} = useContext(Context)
    const [user] = useAuthState(auth)
    const [loading, setLoading] = useState(true)
    const [isAutoScroll, setIsAutoScroll] = useState(true)
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const messagesAnchorRef = useRef<HTMLDivElement | null>(null)
    const [clock, setClock] = useState(() => Date.now())

    useEffect(() => { const timer = window.setInterval(() => setClock(Date.now()), 1000); return () => window.clearInterval(timer) }, [])
    const messagesCollection = collection(firestore, 'messages')
    const queryMessages = useMemo(() => query(messagesCollection, orderBy('createdAt', 'desc'), limit(100)), [firestore])
    const [snapshot, error] = useCollection(queryMessages)
    const messages = useMemo(() => snapshot?.docs.map(item => ({id: item.id, ...item.data()} as ChatMessageType)).reverse() || [], [snapshot])

    useEffect(() => { if (snapshot || error) setLoading(false) }, [snapshot, error])
    useEffect(() => {
        if (!isAutoScroll) return
        const container = scrollContainerRef.current
        if (container) container.scrollTo({top: container.scrollHeight, behavior: 'smooth'})
        else messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'})
    }, [messages, isAutoScroll])
    const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => { const el = event.currentTarget; setIsAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 160) }
    const editMessage = useCallback(async (id: string, message: string) => { if (!user) return; const messageRef = doc(firestore, 'messages', id); const current = (await getDocs(query(collection(firestore, 'messages')))).docs.find(item => item.id === id); if (!current || current.data().userId !== user.uid || Date.now() - (current.data().createdAt?.seconds || 0) * 1000 > EDIT_WINDOW_SECONDS * 1000) return; await updateDoc(messageRef, {message, updatedAt: serverTimestamp()}) }, [firestore, user])
    return <Container maxWidth="md" className="app-page"><Paper className="app-panel" sx={{height: {xs: 'calc(100vh - 150px)', md: 'calc(100vh - 160px)'}, minHeight: 420, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}><Box sx={{px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider'}}><Typography variant="h5">Общий чат</Typography><Typography variant="body2" color="text.secondary">Последние 100 сообщений</Typography></Box>{loading ? <Box sx={{p: 2}}><Skeleton variant="text" width="35%" height={32}/><Skeleton variant="rounded" height={64} sx={{my: 1}}/><Skeleton variant="rounded" height={64} sx={{my: 1, ml: '12%'}}/><Skeleton variant="rounded" height={64} sx={{my: 1}}/></Box> : error ? <Alert severity="error" sx={{m: 2}}>Не удалось загрузить сообщения.</Alert> : <Box ref={scrollContainerRef} onScroll={scrollHandler} sx={{flex: 1, minHeight: 0, overflowY: 'auto', p: {xs: 1, sm: 2}, bgcolor: 'action.hover'}}>{messages.map(msg => <Box key={msg.id} sx={{mb: 1.25, maxWidth: 'min(88%, 680px)', ml: user?.uid === msg.userId ? 'auto' : 0}}><Message idMessage={msg.id} userId={msg.userId} photoURL={msg.photoURL} displayName={msg.displayName} message={msg.message} seconds={msg.createdAt?.seconds || null} canEdit={user?.uid === msg.userId && Boolean(msg.createdAt && clock / 1000 - msg.createdAt.seconds <= EDIT_WINDOW_SECONDS)} onEdit={editMessage}/></Box>)}<div ref={messagesAnchorRef}/></Box>}<Box sx={{p: {xs: 1, sm: 2}, borderTop: 1, borderColor: 'divider'}}><AddMessageForm user={user} onSent={() => { setIsAutoScroll(true); requestAnimationFrame(() => { const container = scrollContainerRef.current; if (container) container.scrollTo({top: container.scrollHeight, behavior: 'smooth'}) }) }}/></Box></Paper></Container>
}
