import {doc, getDoc, getFirestore} from 'firebase/firestore'
import {userType} from '../types/types'

export const profileAPI = {
    async getProfile(userId: string) {
        console.log(userId)
        const userDocRef = doc(getFirestore(), 'users', userId)
        const userDoc = await getDoc(userDocRef)
        return userDoc.data() as userType
    },
}