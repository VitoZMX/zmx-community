import React, {useContext, useEffect, useState} from 'react'
import {Alert, Avatar, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Stack, TextField, Typography} from '@mui/material'
import {NavLink, useLocation, useNavigate, useParams} from 'react-router-dom'
import ReplyIcon from '@mui/icons-material/Reply'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import {Context} from '../../../App'
import {Preloader} from '../../common/Preloader'
import {profileAPI} from '../../../api/profile-api'
import {newsAPI} from '../../../api/news-api'
import {commentsAPI} from '../../../api/comments-api'
import {getNewsReaction, toggleNewsReaction} from '../../../api/news-reactions-api'
import {permissionsFor} from '../../../roles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import {NewsAddMessagesType, NewsCommentType, userType} from '../../../types/types'

export type PathParamsType = {newsID?: string}
type NewsType = NewsAddMessagesType
const EDIT_WINDOW_MS = 5 * 60 * 1000
const formatDate = (value?: {seconds: number} | null) => value ? new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value.seconds * 1000)) : '—'
const canEditComment = (comment: NewsCommentType) => Boolean(comment.createdAt && Date.now() - comment.createdAt.seconds * 1000 <= EDIT_WINDOW_MS)

export function NewsMore() {
    const {user, rolePermissions} = useContext(Context)
    const params = useParams<PathParamsType>()
    const location = useLocation()
    const navigate = useNavigate()
    const [news, setNews] = useState<NewsType>()
    const [author, setAuthor] = useState<userType>()
    const [comments, setComments] = useState<NewsCommentType[]>([])
    const [newsReaction, setNewsReaction] = useState<'like' | 'dislike' | undefined>()
    const [commentText, setCommentText] = useState('')
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [commentSaving, setCommentSaving] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
    const [editingCommentText, setEditingCommentText] = useState('')
    const [error, setError] = useState('')
    const [draft, setDraft] = useState({title: '', MinText: '', MaxText: ''})
    const [confirmDelete, setConfirmDelete] = useState(false)

    const loadComments = async (newsId: string) => setComments(await commentsAPI.getForNews(newsId, user?.uid))

    useEffect(() => {
        const load = async () => {
            if (!params.newsID) return
            const data = await newsAPI.getNewsById(params.newsID)
            if (!data) { navigate('/news'); return }
            setNews(data)
            setDraft({title: data.title || '', MinText: data.MinText || '', MaxText: data.MaxText || ''})
            if (new URLSearchParams(location.search).get('edit') === '1' && user?.uid === data.userId) setEditing(true)
            if (data.userId) setAuthor(await profileAPI.getProfile(data.userId))
            await loadComments(data.id)
            setNewsReaction(await getNewsReaction(data.id, user?.uid))
        }
        load().catch(() => setError('Не удалось загрузить новость или комментарии'))
    }, [params.newsID, navigate, location.search, user?.uid])

    const save = async () => {
        if (!news || !user || user.uid !== news.userId || !draft.title.trim()) return
        setSaving(true); setError('')
        try { await newsAPI.updateNews(news.id, user.uid, draft); setNews({...news, ...draft, updatedAt: {seconds: Math.floor(Date.now() / 1000)}}); setEditing(false) }
        catch { setError('Не удалось сохранить изменения') } finally { setSaving(false) }
    }

    const approve = async () => { if (!news || !user || !canApprove) return; try { await newsAPI.approveNews(news.id, {uid: user.uid, displayName: user.displayName, photoURL: user.photoURL}); setNews({...news, status: 'published', isPublic: true, approvedBy: user.uid, approvedByName: user.displayName || '', approvedAt: {seconds: Math.floor(Date.now() / 1000)}}) } catch { setError('Не удалось одобрить новость') } }
    const toggleVisibility = async () => { if (!news || !user) return; try { await newsAPI.setVisibility(news.id, user.uid, news.isPublic === false); setNews({...news, isPublic: news.isPublic === false}) } catch { setError('Не удалось изменить видимость') } }
    const deleteArticle = async () => { if (!news || !user) return; try { await newsAPI.deleteNews(news.id, user.uid); navigate('/news') } catch { setError('Не удалось удалить новость') } }

    const addComment = async () => {
        if (!news || !user || !commentText.trim() || commentSaving) return
        setCommentSaving(true); setError('')
        try {
            await commentsAPI.add(news.id, {text: commentText.trim(), userId: user.uid, authorName: user.displayName || 'Пользователь', authorPhotoURL: user.photoURL || null})
            setCommentText(''); await loadComments(news.id)
        } catch { setError('Не удалось добавить комментарий') } finally { setCommentSaving(false) }
    }

    const toggleNewsLike = async (reaction: 'like' | 'dislike') => { if (!news || !user) return; await toggleNewsReaction(news.id, user.uid, reaction); setNewsReaction(await getNewsReaction(news.id, user.uid)) }
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
    const canEdit = Boolean(user && user.uid === news.userId && !news.approvedAt)
    const canApprove = Boolean(user && (user.role === 'admin' || user.role === 'moderator') && !news.approvedAt)
    const canComment = Boolean(user && permissionsFor(user.role, rolePermissions).comment)
    return <Container maxWidth="md" sx={{mt: 10, mb: 8}}>
        <Button variant="outlined" onClick={() => navigate('/news')}><ReplyIcon/>Назад к новостям</Button>
        {canApprove && <Button size="small" color="success" sx={{mr: 1, mb: 1}} startIcon={<CheckCircleIcon/>} onClick={() => void approve()}>Одобрить</Button>}{canEdit && <Stack direction="row" justifyContent="flex-end" spacing={.5} sx={{mb: 1}}><IconButton aria-label="Изменить видимость" onClick={toggleVisibility}>{news.isPublic === false ? <VisibilityOffIcon/> : <VisibilityIcon/>}</IconButton><IconButton aria-label="Редактировать статью" onClick={() => setEditing(true)}><EditIcon/></IconButton><IconButton aria-label="Удалить статью" color="error" onClick={() => setConfirmDelete(true)}><DeleteOutlineIcon/></IconButton></Stack>}
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}><DialogTitle>Подтвердите удаление</DialogTitle><DialogContent><DialogContentText>Точно удалить «{news.title}»?</DialogContentText></DialogContent><DialogActions><Button onClick={() => setConfirmDelete(false)}>Нет</Button><Button color="error" onClick={deleteArticle}>Да, удалить</Button></DialogActions></Dialog>
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
        <Grid container spacing={2} sx={{mt: 1}}><Grid item xs={12}>
            {editing ? <Stack spacing={2}><TextField label="Заголовок" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})}/><TextField label="Краткое описание" value={draft.MinText} onChange={e => setDraft({...draft, MinText: e.target.value})}/><TextField label="Текст новости" multiline minRows={8} value={draft.MaxText} onChange={e => setDraft({...draft, MaxText: e.target.value})}/><Stack direction="row" spacing={1}><Button onClick={() => setEditing(false)}>Отмена</Button><Button variant="contained" onClick={save} disabled={saving}>Сохранить</Button></Stack></Stack> : <>
                <Typography variant="h3" component="h1" gutterBottom>{news.title}</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" sx={{mb: 2}}><Typography variant="body2">Автор: <Button component={NavLink} to={`/profile/${news.userId}`} size="small" sx={{p: 0, minWidth: 0, verticalAlign: 'baseline'}}>{author?.displayName || news.authorName || news.userId}</Button></Typography><Typography variant="body2">Опубликовано: {formatDate(news.createdAt)}</Typography>{news.updatedAt && <Typography variant="body2">Изменено: {formatDate(news.updatedAt)}</Typography>}{news.approvedBy && <Stack direction="row" spacing={.5} alignItems="center"><CheckCircleIcon color="success" fontSize="small"/><Typography variant="body2">Проверил: <Button component={NavLink} to={`/profile/${news.approvedBy}`} size="small" sx={{p: 0, minWidth: 0, verticalAlign: 'baseline'}}>{news.approvedByName || news.approvedBy}</Button> ({formatDate(news.approvedAt)})</Typography></Stack>}</Stack>
                {news.img && <img src={news.img} alt={news.title} style={{width: '100%', maxHeight: 480, objectFit: 'cover', borderRadius: 12}}/>}
                <Typography component="div" sx={{mt: 3, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{news.MaxText}</Typography><Stack direction="row" spacing={1} alignItems="center" sx={{mt: 3}}><Typography variant="body2">Оценить новость:</Typography><IconButton size="small" aria-label="Нравится новость" color={newsReaction === 'like' ? 'primary' : 'default'} onClick={() => toggleNewsLike('like')} disabled={!user}><ThumbUpAltOutlinedIcon fontSize="small"/></IconButton><IconButton size="small" aria-label="Не нравится новость" color={newsReaction === 'dislike' ? 'error' : 'default'} onClick={() => toggleNewsLike('dislike')} disabled={!user}><ThumbDownAltOutlinedIcon fontSize="small"/></IconButton></Stack>
            </>}
        </Grid><Grid item xs={12} sx={{mt: 3}}><Divider/><Typography variant="h5" sx={{mt: 3, mb: 2}}>Комментарии ({comments.length})</Typography>
            {canComment && <Stack spacing={1} sx={{mb: 3}}><TextField fullWidth multiline minRows={2} label="Ваш комментарий" value={commentText} onChange={e => setCommentText(e.target.value)} /><Button variant="contained" sx={{alignSelf: 'flex-start'}} onClick={addComment} disabled={commentSaving || !commentText.trim()}>{commentSaving ? 'Публикация...' : 'Добавить комментарий'}</Button></Stack>}
            <Stack spacing={2}>{comments.map(comment => <Stack key={comment.id} direction="row" spacing={1.5} alignItems="flex-start"><Avatar src={comment.authorPhotoURL || undefined} alt={comment.authorName}>{comment.authorName?.[0]}</Avatar><Stack sx={{flex: 1}} spacing={.5}>{editingCommentId === comment.id ? <><TextField fullWidth multiline value={editingCommentText} onChange={e => setEditingCommentText(e.target.value)}/><Stack direction="row"><Button size="small" onClick={() => setEditingCommentId(null)}>Отмена</Button><Button size="small" onClick={saveComment} disabled={commentSaving}>Сохранить</Button></Stack></> : <><Stack direction="row" spacing={1} alignItems="baseline"><Button component={NavLink} to={`/profile/${comment.userId}`} size="small" sx={{p: 0, minWidth: 0, fontWeight: 700, justifyContent: 'flex-start'}}>{comment.authorName}</Button><Typography variant="caption">{formatDate(comment.createdAt)}{comment.updatedAt ? ' (изменён)' : ''}</Typography></Stack><Typography sx={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{comment.text}</Typography><Stack direction="row" alignItems="center"><IconButton size="small" color={user && comment.currentReaction === 'like' ? 'primary' : 'default'} onClick={() => toggleReaction(comment, 'like')} disabled={!user}><ThumbUpAltOutlinedIcon fontSize="small"/></IconButton><Typography variant="caption">{comment.likeCount || 0}</Typography><IconButton size="small" color={user && comment.currentReaction === 'dislike' ? 'error' : 'default'} onClick={() => toggleReaction(comment, 'dislike')} disabled={!user}><ThumbDownAltOutlinedIcon fontSize="small"/></IconButton><Typography variant="caption">{comment.dislikeCount || 0}</Typography>{user?.uid === comment.userId && canEditComment(comment) && <Button size="small" onClick={() => {setEditingCommentId(comment.id); setEditingCommentText(comment.text)}}>Редактировать</Button>}</Stack></>}</Stack></Stack>)}</Stack>
        </Grid></Grid>
    </Container>
}
