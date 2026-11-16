import React, {useContext, useEffect, useState} from 'react'
import {Alert, Avatar, Button, Container, Divider, Grid, IconButton, Stack, TextField, Typography} from '@mui/material'
import {useNavigate, useParams} from 'react-router-dom'
import ReplyIcon from '@mui/icons-material/Reply'
import EditIcon from '@mui/icons-material/Edit'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import {Context} from '../../../App'
import {Preloader} from '../../common/Preloader'
import {profileAPI} from '../../../api/profile-api'
import {newsAPI} from '../../../api/news-api'
import {commentsAPI} from '../../../api/comments-api'
import {NewsAddMessagesType, NewsCommentType, userType} from '../../../types/types'

export type PathParamsType = {newsID?: string}
type NewsType = NewsAddMessagesType
const EDIT_WINDOW_MS = 5 * 60 * 1000
const formatDate = (value?: {seconds: number} | null) => value ? new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value.seconds * 1000)) : '—'
const canEditComment = (comment: NewsCommentType) => Boolean(comment.createdAt && Date.now() - comment.createdAt.seconds * 1000 <= EDIT_WINDOW_MS)

export function NewsMore() {
    const {user} = useContext(Context)
    const params = useParams<PathParamsType>()
    const navigate = useNavigate()
    const [news, setNews] = useState<NewsType>()
    const [author, setAuthor] = useState<userType>()
    const [comments, setComments] = useState<NewsCommentType[]>([])
    const [commentText, setCommentText] = useState('')
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [commentSaving, setCommentSaving] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingCommentText, setEditingCommentText] = useState('')
    const [error, setError] = useState('')
    const [draft, setDraft] = useState({title: '', MinText: '', MaxText: ''})

    const loadComments = async (newsId: string) => setComments(await commentsAPI.getForNews(newsId, user?.uid))

    useEffect(() => {
        const load = async () => {
            if (!params.newsID) return
            const data = await newsAPI.getNewsById(params.newsID)
            if (!data) { navigate('/news'); return }
            setNews(data)
            setDraft({title: data.title || '', MinText: data.MinText || '', MaxText: data.MaxText || ''})
            if (data.userId) setAuthor(await profileAPI.getProfile(data.userId))
            await loadComments(data.id)
        }
        load().catch(() => setError('Не удалось загрузить новость или комментарии'))
    }, [params.newsID, navigate])

    const save = async () => {
        if (!news || !user || user.uid !== news.userId || !draft.title.trim()) return
        setSaving(true); setError('')
        try { await newsAPI.updateNews(news.id, user.uid, draft); setNews({...news, ...draft, updatedAt: {seconds: Math.floor(Date.now() / 1000)}}); setEditing(false) }
        catch { setError('Не удалось сохранить изменения') } finally { setSaving(false) }
    }

    const addComment = async () => {
        if (!news || !user || !commentText.trim() || commentSaving) return
        setCommentSaving(true); setError('')
        try {
            await commentsAPI.add(news.id, {text: commentText.trim(), userId: user.uid, authorName: user.displayName || 'Пользователь', authorPhotoURL: user.photoURL || null})
            setCommentText(''); await loadComments(news.id)
        } catch { setError('Не удалось добавить комментарий') } finally { setCommentSaving(false) }
    }

    const toggleReaction = async (comment: NewsCommentType, reaction: 'like' | 'dislike') => {
        if (!news || !user) return
        try { await commentsAPI.setReaction(news.id, comment.id, user.uid, reaction); await loadComments(news.id) }
        catch { setError('Не удалось изменить реакцию') }
    }

    const saveComment = async () => {
        if (!news || !user || !editingCommentId || !editingCommentText.trim()) return
        setCommentSaving(true)
        try { await commentsAPI.update(news.id, editingCommentId, user.uid, editingCommentText); setEditingCommentId(null); setEditingCommentText(''); await loadComments(news.id) }
        catch (e: any) { setError(e?.message === 'Edit window expired' ? 'Редактировать комментарий можно только в течение 5 минут.' : 'Не удалось сохранить комментарий') }
        finally { setCommentSaving(false) }
    }

    if (!news) return <Preloader/>
    const canEdit = Boolean(user && user.uid === news.userId)
    return <Container maxWidth="md" sx={{mt: 10, mb: 8}}>
        <Button variant="outlined" onClick={() => navigate('/news')}><ReplyIcon/>Назад к новостям</Button>
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        <Grid container spacing={2} sx={{mt: 1}}><Grid item xs={12}>
            {editing ? <Stack spacing={2}><TextField label="Заголовок" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})}/><TextField label="Краткое описание" value={draft.MinText} onChange={e => setDraft({...draft, MinText: e.target.value})}/><TextField label="Текст новости" multiline minRows={8} value={draft.MaxText} onChange={e => setDraft({...draft, MaxText: e.target.value})}/><Stack direction="row" spacing={1}><Button onClick={() => setEditing(false)}>Отмена</Button><Button variant="contained" onClick={save} disabled={saving}>Сохранить</Button></Stack></Stack> : <>
                <Typography variant="h3" component="h1" gutterBottom>{news.title}</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{mb: 2}}><Typography variant="body2">Автор: {author?.displayName || news.authorName || news.userId}</Typography><Typography variant="body2">Опубликовано: {formatDate(news.createdAt)}</Typography>{news.updatedAt && <Typography variant="body2">Изменено: {formatDate(news.updatedAt)}</Typography>}</Stack>
                {news.img && <img src={news.img} alt={news.title} style={{width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 12}}/>}
                <Typography component="div" sx={{mt: 3, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{news.MaxText}</Typography>
                {canEdit && <Button sx={{mt: 3}} variant="outlined" startIcon={<EditIcon/>} onClick={() => setEditing(true)}>Редактировать статью</Button>}
            </>}
        </Grid><Grid item xs={12} sx={{mt: 3}}><Divider/><Typography variant="h5" sx={{mt: 3, mb: 2}}>Комментарии ({comments.length})</Typography>
            {user && <Stack spacing={1} sx={{mb: 3}}><TextField fullWidth multiline minRows={2} label="Ваш комментарий" value={commentText} onChange={e => setCommentText(e.target.value)} /><Button variant="contained" sx={{alignSelf: 'flex-start'}} onClick={addComment} disabled={commentSaving || !commentText.trim()}>{commentSaving ? 'Публикация...' : 'Добавить комментарий'}</Button></Stack>}
            <Stack spacing={2}>{comments.map(comment => <Stack key={comment.id} direction="row" spacing={1.5} alignItems="flex-start"><Avatar src={comment.authorPhotoURL || undefined} alt={comment.authorName}>{comment.authorName?.[0]}</Avatar><Stack sx={{flex: 1}} spacing={.5}>{editingCommentId === comment.id ? <><TextField fullWidth multiline value={editingCommentText} onChange={e => setEditingCommentText(e.target.value)}/><Stack direction="row"><Button size="small" onClick={() => setEditingCommentId(null)}>Отмена</Button><Button size="small" onClick={saveComment} disabled={commentSaving}>Сохранить</Button></Stack></> : <><Stack direction="row" spacing={1} alignItems="baseline"><Typography fontWeight="bold">{comment.authorName}</Typography><Typography variant="caption">{formatDate(comment.createdAt)}{comment.updatedAt ? ' (изменён)' : ''}</Typography></Stack><Typography sx={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{comment.text}</Typography><Stack direction="row" alignItems="center"><IconButton size="small" color={user && comment.currentReaction === 'like' ? 'primary' : 'default'} onClick={() => toggleReaction(comment, 'like')} disabled={!user}><ThumbUpAltOutlinedIcon fontSize="small"/></IconButton><Typography variant="caption">{comment.likeCount || 0}</Typography><IconButton size="small" color={user && comment.currentReaction === 'dislike' ? 'error' : 'default'} onClick={() => toggleReaction(comment, 'dislike')} disabled={!user}><ThumbDownAltOutlinedIcon fontSize="small"/></IconButton><Typography variant="caption">{comment.dislikeCount || 0}</Typography>{user?.uid === comment.userId && canEditComment(comment) && <Button size="small" onClick={() => {setEditingCommentId(comment.id); setEditingCommentText(comment.text)}}>Редактировать</Button>}</Stack></>}</Stack></Stack>)}</Stack>
        </Grid></Grid>
    </Container>
}
