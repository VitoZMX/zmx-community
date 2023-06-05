import React, {useEffect, useState} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {useNavigate, useParams} from 'react-router-dom'
import {collection, doc, getDoc, getFirestore} from 'firebase/firestore'
import {Preloader} from './common/Preloader'
import Button from '@mui/material/Button'
import ReplyIcon from '@mui/icons-material/Reply'

export type PathParamsType = {
    newsID?: string
}

type NewsType = {
    id: string;
    img: string;
    title: string;
    MaxText: string;
    MinText: string;
    createdAt: {
        seconds: number;
    } | null;
    userId: string
}

export function NewsMore() {
    const params = useParams<PathParamsType>()
    const [news, setNews] = useState<NewsType>()
    const navigate = useNavigate()

    const handleClickGoToNewsPage = () => {
        navigate('/news')
    }

    async function getNewsById(id: string) {
        const firestore = getFirestore()
        const collectionRef = collection(firestore, 'news')
        const objectRef = doc(collectionRef, id)
        const objectSnapshot = await getDoc(objectRef)
        if (objectSnapshot.exists()) {
            let data = objectSnapshot.data() as NewsType
            setNews(data)
            console.log(data)
        } else {
            handleClickGoToNewsPage()
            return null
        }
    }

    useEffect(() => {
        const refreshNews = async () => {
            let newsId = params.newsID
            if (!newsId) {
                return
            }
            await getNewsById(newsId)
        }
        refreshNews()
    }, [params.newsID])

    return (
        <Container style={{marginTop: '70px'}}>
            <Button variant="outlined" onClick={handleClickGoToNewsPage}>
                <ReplyIcon/>
                Back to news
            </Button>
            <Grid container spacing={1} alignItems="stretch">
                {news ? (
                    <div style={{width: '100%'}}>
                        <h1 style={{textIndent: '12px'}}>{news?.title}</h1>
                        <hr/>
                        <h2 style={{textIndent: '12px'}}>
                            <pre style={{
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'break-word',
                                wordWrap: 'break-word'
                            }}>{news?.MaxText}</pre>
                        </h2>
                        <img src={news?.img} style={{width: '100%'}}/>
                        <h5>Автор ID: {news.userId}</h5>
                    </div>
                ) : (
                    <Preloader/>
                )}
            </Grid>
        </Container>
    )
}