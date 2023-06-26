import {collection, getDocs, getFirestore} from 'firebase/firestore'
import {NewsAddMessagesType} from '../types/types'

export const newsAPI = {
    async getAllNews() {
        const newsCollectionRef = collection(getFirestore(), 'news')
        const querySnapshot = await getDocs(newsCollectionRef)
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as NewsAddMessagesType[]
    }
}