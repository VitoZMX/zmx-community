import {
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where
} from 'firebase/firestore'
import {userType} from '../types/types'

export const usersAPI = {
    async getAllUsers() {
        const usersCollectionRef = collection(getFirestore(), 'users')
        const querySnapshot = await getDocs(usersCollectionRef)
        return querySnapshot.docs.map((doc) => doc.data()) as userType[]
    },
    async addFriend(friendId: string, userId: string) {
        const userDocRef = doc(getFirestore(), `users/${userId}`)
        await updateDoc(userDocRef,
            {
                friends: arrayUnion(friendId)
            })
        const userDocSnap = await getDoc(userDocRef)
        return userDocSnap.data() as userType
    },
    async getUsersByIds(ids: string[]) {
        if (ids.length === 0) {
            return [] // возвращаем пустой массив, если ids пустой
        }
        const usersCollectionRef = collection(getFirestore(), 'users')
        const queryRef = query(usersCollectionRef, where('uid', 'in', ids))
        const querySnapshot = await getDocs(queryRef)
        const usersData = querySnapshot.docs.map((doc) => doc.data()) as userType[]
        if (usersData.length === 0) {
            return []
        }
        return usersData
    },
    async delFriend(friendId: string, userId: string) {
        const userDocRef = doc(getFirestore(), 'users', userId)
        await updateDoc(userDocRef, {
            friends: arrayRemove(friendId)
        })
        const userDocSnap = await getDoc(userDocRef)
        return userDocSnap.data() as userType
    }
}