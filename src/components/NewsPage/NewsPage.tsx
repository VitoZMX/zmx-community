import React, {useEffect, useState} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {CartNews} from './CartNews/CartNews'
import {AddNewsForm} from './AddNewsForm'
import logoNoImg from '../../assets/image/logoNoImg.png'
import {QuickBytes} from './QuickBytes/QuickBytes'
import {AllQuickBytesType, NewsAddMessagesType, quickBytesType} from '../../types/types'
import {Preloader} from '../common/Preloader'
import {quickBytesAPI} from '../../api/quickBytes-api'
import {profileAPI} from '../../api/profile-api'
import {newsAPI} from '../../api/news-api'

export function NewsPage() {
    const [news, setNews] = useState<NewsAddMessagesType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [quickBytes, setQuickBytes] = useState<quickBytesType[]>([])
    const [quickBytesAndAuthorData, setQuickBytesAndAuthorData] = useState<AllQuickBytesType[]>([])

    useEffect(() => {
        quickBytesAPI.getQuickBytes().then(data => setQuickBytes(data))
    }, [])

    useEffect(() => {
        if (quickBytes.length > 0) {
            const ids = quickBytes
                .map(async (item) => {
                    const userData = await profileAPI.getProfile(item.userId)
                    return {
                        id: item.id,
                        createdAt: item.createdAt,
                        text: item.text,
                        uid: item.userId,
                        userId: item.userId,
                        speak: item.speak || 'Говорит',
                        displayName: userData.displayName || '',
                        photoURL: userData.photoURL || null,
                        friends: userData.friends
                    }
                })
            Promise.all(ids).then((newData) => {
                setQuickBytesAndAuthorData(newData)
            }).then(() => setLoading(false))
        }
    }, [quickBytes])

    useEffect(() => {
        newsAPI.getAllNews().then(newsData => setNews(newsData))
    }, [])

    return (
        <div>
            {loading ?
                (<Preloader/>)
                :
                (<Container style={{marginTop: '60px', marginBottom: '55px'}}>
                    <AddNewsForm/>
                    <Grid container spacing={1}
                          sx={{direction: 'row', justifyContent: 'flex-start', alignItems: 'stretch'}}>
                        <Grid item xs={12} sm={6} md={3} style={{}}>
                            <QuickBytes qBytesData={quickBytesAndAuthorData}/>
                        </Grid>
                        {news.reverse().map((e) => {
                            return <Grid key={e.id} item xs={12} sm={6} md={3}>
                                <CartNews img={e.img ? e.img : logoNoImg} title={e.title} text={e.MinText}
                                          id={e.id}/>
                            </Grid>
                        })}
                    </Grid>
                </Container>)
            }
        </div>
    )
}