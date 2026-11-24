import React, {useEffect, useState} from 'react'
import {Avatar, Box, ButtonBase, IconButton, Stack, TextField, Typography} from '@mui/material'
import {NavLink} from 'react-router-dom'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import {MessageTypeProps} from '../types/types'

const formatDateTime = (seconds: number | null) => seconds ? new Intl.DateTimeFormat('ru-RU', {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(seconds * 1000)) : 'сейчас'

export const Message: React.FC<MessageTypeProps> = React.memo(({photoURL, displayName, message, seconds, idMessage, userId, canEdit, onEdit}) => {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(message)
    useEffect(() => setDraft(message), [message])
    const save = async () => { if (draft.trim() && draft.trim() !== message) await onEdit(idMessage, draft.trim()); setEditing(false) }
    return <Box sx={{p: 1.25, borderRadius: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', minWidth: 0}}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: .5}}>
            <Avatar src={photoURL || undefined} alt={displayName} sx={{width: 32, height: 32}}/>
            <Box sx={{minWidth: 0, flex: 1}}><ButtonBase component={NavLink} to={`/profile/${userId || ''}`} sx={{display: 'block', textAlign: 'left', borderRadius: 1, color: 'inherit'}}><Typography variant="subtitle2" noWrap>{displayName}</Typography></ButtonBase><Typography variant="caption" color="text.secondary">{formatDateTime(seconds)}</Typography></Box>
            {canEdit && !editing && <IconButton size="small" aria-label="Редактировать сообщение" onClick={() => setEditing(true)}><EditOutlinedIcon fontSize="small"/></IconButton>}
        </Stack>
        {editing ? <Stack direction="row" spacing={.5} alignItems="flex-start"><TextField size="small" fullWidth value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => {if (e.key === 'Enter' && !e.shiftKey) {e.preventDefault(); void save()} if (e.key === 'Escape') setEditing(false)}} inputProps={{maxLength: 2000}} autoFocus/><IconButton aria-label="Сохранить" onClick={() => void save()}><CheckIcon/></IconButton><IconButton aria-label="Отмена" onClick={() => setEditing(false)}><CloseIcon/></IconButton></Stack> : <Typography sx={{whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{message}</Typography>}
    </Box>
})
