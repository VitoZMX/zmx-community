import React, {useContext, useEffect, useState} from 'react'
import {Container} from '@material-ui/core'
import Grid from '@mui/material/Grid'
import {Context} from '../../App'
import {useAuthState} from 'react-firebase-hooks/auth'
import {CartNews} from './CartNews/CartNews'
import {AddNewsForm} from '../AddNewsForm'
import {collection, getFirestore, orderBy, query} from 'firebase/firestore'
import logoNoImg from '../../assets/image/logoNoImg.png'
import {useCollection} from 'react-firebase-hooks/firestore'
import {QuickBytes} from './QuickBytes/QuickBytes'
import {useTheme} from '@mui/material'
import {NewsAddMessagesType} from '../../types/types'
import {Preloader} from '../common/Preloader'

export function NewsPage() {
    const {auth} = useContext(Context)
    const [user] = useAuthState(auth)
    const theme = useTheme()
    const [news, setNews] = useState<NewsAddMessagesType[]>([])

    const [loading, setLoading] = useState<boolean>(true)
    const newsCollection = collection(getFirestore(), 'news')
    const queryNews = query(newsCollection, orderBy('createdAt'))
    const [newsSnapshot, error] = useCollection(queryNews)

    useEffect(() => {
        if (newsSnapshot) {
            const newsData = newsSnapshot.docs.map((doc) => ({
                id: doc.id,
                img: doc.data().img,
                title: doc.data().title,
                MinText: doc.data().MinText,
                MaxText: doc.data().MaxText,
                text: doc.data().text,
                createdAt: doc.data().createdAt,
                userId: doc.data().userId,
            }))
            setNews(newsData)
            setLoading(false)
        }
    }, [newsSnapshot])

    return (
        <div>
            {loading ?
                (<Preloader/>)
                :
                (<Container style={{marginTop: '80px'}}>
                    <AddNewsForm/>
                    <Grid container spacing={1}
                          sx={{direction: 'row', justifyContent: 'flex-start', alignItems: 'stretch'}}>
                        <Grid item xs={12} sm={6} md={3} style={{}}>
                            <QuickBytes/>
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