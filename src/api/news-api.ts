import {collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, serverTimestamp, updateDoc, where} from 'firebase/firestore'
import {NewsAddMessagesType} from '../types/types'

const normalizeNews = (item: any): NewsAddMessagesType => ({id: item.id, isPublic: item.isPublic !== false, ...item}) as NewsAddMessagesType

export const newsAPI = {
    async getAllNews() {
        const snapshot = await getDocs(query(collection(getFirestore(), 'news'), orderBy('createdAt', 'desc')))
        return snapshot.docs.map(item => normalizeNews({...item.data(), id: item.id})).filter(item => item.isPublic !== false)
    },
    async getNewsByAuthor(userId: string, viewerId = userId) {
        const newsRef = collection(getFirestore(), 'news')
        const snapshot = viewerId === userId
            ? await getDocs(query(newsRef, where('userId', '==', userId)))
            : await getDocs(query(newsRef, where('isPublic', '==', true)))
        return snapshot.docs
            .map(item => normalizeNews({...item.data(), id: item.id}))
            .filter(item => item.userId === userId && (viewerId === userId || item.isPublic !== false))
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
    },
    async getNewsById(newsId: string) {
        const snapshot = await getDoc(doc(getFirestore(), 'news', newsId))
        return snapshot.exists() ? normalizeNews({...snapshot.data(), id: snapshot.id}) : null
    },
    async updateNews(newsId: string, userId: string, data: Pick<NewsAddMessagesType, 'title' | 'MinText' | 'MaxText'>) {
        const ref = doc(getFirestore(), 'news', newsId)
        const snapshot = await getDoc(ref)
        if (!snapshot.exists() || snapshot.data().userId !== userId) throw new Error('Not allowed')
        if (snapshot.data().approvedAt) throw new Error('Approved news is locked')
        await updateDoc(ref, {...data, updatedAt: serverTimestamp()})
    },
    async setVisibility(newsId: string, userId: string, isPublic: boolean) {
        const ref = doc(getFirestore(), 'news', newsId)
        const snapshot = await getDoc(ref)
        if (!snapshot.exists() || snapshot.data().userId !== userId) throw new Error('Not allowed')
        if (snapshot.data().approvedAt) throw new Error('Approved news is locked')
        await updateDoc(ref, {isPublic, status: isPublic ? 'published' : 'draft', firstPublishedAt: isPublic ? (snapshot.data().firstPublishedAt || serverTimestamp()) : snapshot.data().firstPublishedAt, updatedAt: serverTimestamp()})
    },
    async approveNews(newsId: string, moderator: {uid: string; displayName?: string | null; photoURL?: string | null}) {
        const ref = doc(getFirestore(), 'news', newsId)
        const snapshot = await getDoc(ref)
        if (!snapshot.exists()) throw new Error('Not found')
        await updateDoc(ref, {status: 'published', isPublic: true, firstPublishedAt: snapshot.data().firstPublishedAt || serverTimestamp(), approvedAt: serverTimestamp(), approvedBy: moderator.uid, approvedByName: moderator.displayName || '', approvedByPhotoURL: moderator.photoURL || null})
    },
    async deleteNews(newsId: string, userId: string) {
        const ref = doc(getFirestore(), 'news', newsId)
        const snapshot = await getDoc(ref)
        if (!snapshot.exists() || snapshot.data().userId !== userId) throw new Error('Not allowed')
        await deleteDoc(ref)
    }
}
