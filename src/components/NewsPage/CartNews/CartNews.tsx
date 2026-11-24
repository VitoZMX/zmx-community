import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {CardActionArea} from '@mui/material'
import {NavLink} from 'react-router-dom'
import {CartNewsPropsType} from '../../../types/types'
import {getNewsStats} from '../../../api/news-stats-api'
import {useEffect, useState} from 'react'

type Props = CartNewsPropsType & {view: 'grid' | 'list'; createdAt?: {seconds: number} | null; firstPublishedAt?: {seconds: number} | null; commentCount?: number; likeCount?: number; dislikeCount?: number}
export function CartNews({img, title, text, id, view, createdAt, firstPublishedAt, commentCount = 0, likeCount = 0, dislikeCount = 0}: Props) {
    const [stats, setStats] = useState({commentCount, likeCount, dislikeCount})
    useEffect(() => {getNewsStats(id).then(setStats).catch(() => {})}, [id])
    const publishDate = firstPublishedAt || createdAt
    const compact = view === 'grid'
    return <Card sx={{height: '100%', borderRadius: 2, overflow: 'hidden'}}>
        <CardActionArea component={NavLink} to={`/news/${id}`} sx={{height: '100%', display: compact ? 'block' : 'flex', alignItems: 'stretch'}}>
            <CardMedia component="img" image={img} alt={title} loading="lazy" sx={{width: compact ? '100%' : {xs: 120, sm: 180}, height: compact ? 150 : '100%', minHeight: compact ? 150 : 130, objectFit: 'cover'}}/>
            <CardContent sx={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column'}}><Typography variant="h6" component="h2" sx={{fontWeight: 700, overflowWrap: 'anywhere'}}>{title}</Typography>{!compact && <Typography variant="body2" color="text.secondary" sx={{mt: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{text}</Typography>}<Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 'auto', pt: 1, lineHeight: 1.6, overflowWrap: 'anywhere'}}>Опубликовано: {publishDate ? new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium'}).format(new Date(publishDate.seconds * 1000)) : 'Не опубликовано'}<br/>Комментарии: {stats.commentCount}<br/>👍 {stats.likeCount} · 👎 {stats.dislikeCount}</Typography></CardContent>
        </CardActionArea>
    </Card>
}
