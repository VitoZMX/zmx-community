import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {FirebaseUserAndUserType} from '../App'
import React from 'react'

export type ContextType = {
    auth: ReturnType<typeof getAuth>
    firestore: ReturnType<typeof getFirestore>
    user: FirebaseUserAndUserType | null
    setUser: (user: FirebaseUserAndUserType | null) => void
    userFriends: userType[],
    setUserFriends: (userFriends: userType[]) => void
}

export type userType = {
    uid: string
    displayName: string
    email?: string | null
    age?: string | null
    country?: string | null
    sex?: string | null
    aboutYou?: string | null
    barkMode?: boolean
    photoURL?: string | null
    role?: string
    metadata?: {
        creationTime?: string
        lastSignInTime?: string
    }
    friends: string[]
}

export type NewsAddMessagesType = {
    id: string
    img: string
    title: string
    MaxText: string
    MinText: string
    createdAt: {
        seconds: number
    } | null
    userId: string
}

export type MessageTypeProps = {
    photoURL: string
    displayName: string
    message: string
    seconds: number | null
    idMessage: string
}

export type CartNewsPropsType = {
    img: string
    title: string
    text: string
    id: string
}

export type ChatMessageType = {
    id: string
    photoURL: string
    displayName: string
    message: string
    createdAt: {
        seconds: number
    } | null
    userId: string
}

export type quickBytesType = {
    id: string
    createdAt: string
    text: string
    userId: string
    speak: string
}

export type FriendsTabPanelPropsType = {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export type AllQuickBytesType = quickBytesType & userType