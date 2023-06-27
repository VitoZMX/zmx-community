import {arrayRemove, arrayUnion, doc, getDoc, getFirestore, updateDoc} from 'firebase/firestore'
import {userType} from '../types/types'

export const profileAPI = {
    async getProfile(userId: string) {
        const userDocRef = doc(getFirestore(), 'users', userId)
        const userDoc = await getDoc(userDocRef)
        return userDoc.data() as userType
    },
    async addQBPost(qbPostId: string, userId: string) {
        const qbPostDocRef = doc(getFirestore(), `users/${userId}`)
        await updateDoc(qbPostDocRef,
            {
                qBPostsId: arrayUnion(qbPostId)
            })
        const userDocSnap = await getDoc(qbPostDocRef)
        return userDocSnap.data() as userType
    },
    async delQBPost(idPost: string, userId: string) {
        const qbPostDocRef = doc(getFirestore(), 'users', userId)
        await updateDoc(qbPostDocRef, {
            qBPostsId: arrayRemove(idPost)
        })
        const userDocSnap = await getDoc(qbPostDocRef)
        return userDocSnap.data() as userType
    },
}