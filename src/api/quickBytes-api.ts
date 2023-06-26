import {collection, getDocs, getFirestore, limit, orderBy, query} from 'firebase/firestore'
import {quickBytesType} from '../types/types'

export const quickBytesAPI = {
    async getQuickBytes() {
        const quickBytesCollection = collection(getFirestore(), 'qBPosts')
        const q = query(quickBytesCollection, orderBy('createdAt', 'desc'), limit(6))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            userId: doc.data().userId,
            speak: doc.data().speak || 'Говорит',
        })) as quickBytesType[]
    }
}