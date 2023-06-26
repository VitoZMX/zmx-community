import React, {useContext, useEffect, useState} from 'react'
import {Container} from '@material-ui/core'
import {Context} from '../../App'
import {addDoc, collection, doc, getFirestore, orderBy, query, serverTimestamp} from 'firebase/firestore'
import {useCollection} from 'react-firebase-hooks/firestore'
import {quickBytesType, userType} from '../../types/types'
import {useParams} from 'react-router-dom'
import {profileAPI} from '../../api/profile-api'
import {ProfileData} from './ProfileData/ProfileData'
import {Preloader} from '../common/Preloader'

export type PathParamsType = {
    userID?: string
}

export function ProfilePage() {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState<boolean>(true)
    const [profile, setProfile] = useState<userType | {}>({})
    const params = useParams<PathParamsType>()
    const [value, setValue] = useState('')
    const [valueSpeaks, setValueSpeaks] = useState('Говорит')
    const [qBPostsUser, setqBPostsUser] = useState<quickBytesType[]>([])
    const inputRef = React.useRef<HTMLInputElement>()
    const qBPostsCollection = collection(getFirestore(), 'qBPosts')
    const qBPostsCollectionProfile = collection(getFirestore(), 'quickBytesIdCollection')
    const queryqBPostsProfile = query(qBPostsCollectionProfile, orderBy('createdAt'))
    const [queryqBPostsProfileSnapshot, error] = useCollection(queryqBPostsProfile)

    useEffect(() => {
        if (queryqBPostsProfileSnapshot) {
            const BPostProfile = queryqBPostsProfileSnapshot.docs.map((doc) => ({
                id: doc.id,
                text: doc.data().text,
                userId: doc.data().userId,
                speak: doc.data().speak,
                createdAt: doc.data().createdAt

            }))
            setqBPostsUser(BPostProfile)
        }
    }, [queryqBPostsProfileSnapshot])

    useEffect(() => {
        if (params.userID) {
            profileAPI.getProfile(params.userID).then(data => {
                if (data) {
                    setProfile(data)
                } else {
                    console.log('Пользователь не найден')
                }
            }).then(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [params.userID])

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

    if (loading) {
        return <Preloader/>
    }

    return (
        <Container style={{marginTop: '80px', marginBottom: '80px'}}>
            {params.userID && profile ? (<ProfileData user={profile}/>) : (<ProfileData user={user} autor={true}/>)}
        </Container>
    )
}