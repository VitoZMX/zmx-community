import {addDoc, collection, doc, getDocs, getFirestore, orderBy, query, serverTimestamp, setDoc, updateDoc, deleteDoc} from 'firebase/firestore'
import {NewsCommentType} from '../types/types'

const commentsCollection = (newsId: string) => collection(getFirestore(), 'news', newsId, 'comments')
const reactionsCollection = (newsId: string, commentId: string) => collection(getFirestore(), 'news', newsId, 'comments', commentId, 'reactions')

export const commentsAPI = {
    async getForNews(newsId: string, currentUserId?: string) {
        const commentsSnapshot = await getDocs(query(commentsCollection(newsId), orderBy('createdAt', 'asc')))
        return Promise.all(commentsSnapshot.docs.map(async item => {
            const reactions = await getDocs(reactionsCollection(newsId, item.id))
            let likeCount = 0; let dislikeCount = 0; let currentReaction: 'like' | 'dislike' | undefined
            reactions.forEach(reaction => { const type = reaction.data().type; if (type === 'like') likeCount++; if (type === 'dislike') dislikeCount++; if (reaction.id === currentUserId) currentReaction = type })
            return {id: item.id, ...item.data(), likeCount, dislikeCount, currentReaction} as NewsCommentType
        }))
    },
    async add(newsId: string, data: Pick<NewsCommentType, 'text' | 'userId' | 'authorName' | 'authorPhotoURL'>) {
        const ref = await addDoc(commentsCollection(newsId), {...data, newsId, createdAt: serverTimestamp(), updatedAt: null})
        return ref.id
    },
    async update(newsId: string, commentId: string, userId: string, text: string) {
        const ref = doc(getFirestore(), 'news', newsId, 'comments', commentId)
        const snapshot = await getDocs(query(commentsCollection(newsId)))
        const current = snapshot.docs.find(item => item.id === commentId)
        if (!current || current.data().userId !== userId) throw new Error('Not allowed')
        if (Date.now() - (current.data().createdAt?.seconds || 0) * 1000 > 5 * 60 * 1000) throw new Error('Edit window expired')
        await updateDoc(ref, {text: text.trim(), updatedAt: serverTimestamp()})
    },
    async setReaction(newsId: string, commentId: string, userId: string, reaction: 'like' | 'dislike') {
        const ref = doc(getFirestore(), 'news', newsId, 'comments', commentId, 'reactions', userId)
        const existing = await getDocs(query(reactionsCollection(newsId, commentId)))
        if (existing.docs.some(item => item.id === userId && item.data().type === reaction)) await deleteDoc(ref)
        else await setDoc(ref, {type: reaction, createdAt: serverTimestamp(), updatedAt: null}, {merge: true})
    }
}
