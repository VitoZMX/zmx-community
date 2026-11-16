import {collection, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc} from 'firebase/firestore'
import {NewsAddMessagesType} from '../types/types'

export const newsAPI = {
    async getAllNews() {
        const snapshot = await getDocs(query(collection(getFirestore(), 'news'), orderBy('createdAt', 'desc')))
        return snapshot.docs.map((item) => ({id: item.id, ...item.data()})) as NewsAddMessagesType[]
    },
    async getNewsByAuthor(userId: string) {
        const news = await this.getAllNews()
        return news.filter(item => item.userId === userId)
    },
    async getNewsById(newsId: string) {
        const snapshot = await getDoc(doc(getFirestore(), 'news', newsId))
        return snapshot.exists() ? ({id: snapshot.id, ...snapshot.data()} as NewsAddMessagesType) : null
    },
    async updateNews(newsId: string, userId: string, data: Pick<NewsAddMessagesType, 'title' | 'MinText' | 'MaxText'>) {
        const ref = doc(getFirestore(), 'news', newsId)
        const snapshot = await getDoc(ref)
        if (!snapshot.exists() || snapshot.data().userId !== userId) throw new Error('Not allowed')
        await updateDoc(ref, {...data, updatedAt: serverTimestamp()})
    }
}
