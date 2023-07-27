import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    where
} from 'firebase/firestore'
import {quickBytesType} from '../types/types'

export const quickBytesAPI = {
    async getAllQuickBytes() {
        const quickBytesCollection = collection(getFirestore(), 'qBPosts')
        const q = query(quickBytesCollection, orderBy('createdAt', 'desc'), limit(5))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            userId: doc.data().userId,
            speak: doc.data().speak || 'Говорит',
        })) as quickBytesType[]
    },
    async addQuickBytes(qBPostData: any) {
        const quickBytesCollection = collection(getFirestore(), 'qBPosts')
        return await addDoc(quickBytesCollection, qBPostData).then(res => res.id)
    },
    async delQuickBytes(idPost: string) {
        const quickBytesCollection = collection(getFirestore(), 'qBPosts')
        const docRef = doc(quickBytesCollection, idPost)
        return await deleteDoc(docRef)
    },
    async getQuickBytesByIds(ids: string[]) {
        if (ids.length === 0) {
            return [] // возвращаем пустой массив, если ids пустой
        }
        const quickBytesCollection = collection(getFirestore(), 'qBPosts')
        const q = query(quickBytesCollection, where('__name__', 'in', ids))
        const querySnapshot = await getDocs(q)
        const quickBytesData = querySnapshot.docs.map((doc) => {
            const data = doc.data()
            const id = doc.id
            return {...data, id}
        })
        return quickBytesData as quickBytesType[]
    },
}