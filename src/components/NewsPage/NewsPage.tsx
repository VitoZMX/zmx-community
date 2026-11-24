import React, {useEffect, useState} from 'react'
import GridViewIcon from '@mui/icons-material/GridView'
import ViewListIcon from '@mui/icons-material/ViewList'
import {Alert, Box, Container, Grid, IconButton, Stack, Tooltip, Typography} from '@mui/material'
import {CartNews} from './CartNews/CartNews'
import {AddNewsForm} from './AddNewsForm'
import logoNoImg from '../../assets/image/logoNoImg.png'
import {QuickBytes} from './QuickBytes/QuickBytes'
import {AllQuickBytesType, NewsAddMessagesType} from '../../types/types'
import {Preloader} from '../common/Preloader'
import {quickBytesAPI} from '../../api/quickBytes-api'
import {profileAPI} from '../../api/profile-api'
import {newsAPI} from '../../api/news-api'

export function NewsPage() {
    const [news, setNews] = useState<NewsAddMessagesType[]>([])
    const [loading, setLoading] = useState(true)
    const [quickBytesAndAuthorData, setQuickBytesAndAuthorData] = useState<AllQuickBytesType[]>([])
    const [error, setError] = useState('')
    const [view, setView] = useState<'grid' | 'list'>(() => (typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches ? 'list' : (localStorage.getItem('news-view') as 'grid' | 'list') || 'list'))
    const changeView = (next: 'grid' | 'list') => { setView(next); localStorage.setItem('news-view', next) }

    useEffect(() => { Promise.all([quickBytesAPI.getAllQuickBytes(), newsAPI.getAllNews()]).then(async ([quickBytesData, newsData]) => { setNews(newsData); const authors = await Promise.all(quickBytesData.map(async item => { const profile = await profileAPI.getProfile(item.userId); return {...item, uid: item.userId, displayName: profile.displayName || '', photoURL: profile.photoURL || null, friends: profile.friends} })); setQuickBytesAndAuthorData(authors as AllQuickBytesType[]) }).catch(() => setError('Не удалось загрузить новости')).finally(() => setLoading(false)) }, [])

    if (loading) return <Preloader/>
    const gridMode = view === 'grid'
    const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 600px)').matches
    return <Container className="app-page" maxWidth="xl">
        {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
        <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={1} sx={{mb: 2}}><Typography variant="h4" component="h1">Новости</Typography><Stack direction="row" alignItems="center" spacing={1}><AddNewsForm/><Box sx={{display: {xs: 'none', sm: 'flex'}}}><Tooltip title="Плитки"><IconButton aria-label="Плиточный вид" color={gridMode ? 'primary' : 'default'} onClick={() => changeView('grid')}><GridViewIcon/></IconButton></Tooltip><Tooltip title="Список"><IconButton aria-label="Вид списком" color={!gridMode ? 'primary' : 'default'} onClick={() => changeView('list')}><ViewListIcon/></IconButton></Tooltip></Box></Stack></Stack>
        {mobile ? <Stack spacing={2}><QuickBytes collapsed qBytesData={quickBytesAndAuthorData}/>{news.map(item => <CartNews key={item.id} view="list" img={item.img || logoNoImg} title={item.title} text={item.MinText} id={item.id} createdAt={item.createdAt} firstPublishedAt={item.firstPublishedAt}/>)}</Stack> : gridMode ? <Grid container spacing={2} alignItems="stretch"><Grid item xs={12} md={6} lg={6} sx={{gridRow: {md: 'span 3'}, minHeight: {md: 450}}}><QuickBytes qBytesData={quickBytesAndAuthorData}/></Grid>{news.map(item => <Grid item xs={12} sm={6} md={3} lg={3} key={item.id}><CartNews view="grid" img={item.img || logoNoImg} title={item.title} text={item.MinText} id={item.id} createdAt={item.createdAt} firstPublishedAt={item.firstPublishedAt}/></Grid>)}</Grid> : <Stack spacing={2}><QuickBytes collapsed qBytesData={quickBytesAndAuthorData}/>{news.map(item => <CartNews key={item.id} view="list" img={item.img || logoNoImg} title={item.title} text={item.MinText} id={item.id} createdAt={item.createdAt} firstPublishedAt={item.firstPublishedAt}/>)}</Stack>}
    </Container>
}
