import React from 'react'
import {Accordion, AccordionDetails, AccordionSummary, Avatar, Card, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {AllQuickBytesType} from '../../../types/types'

type Props = {qBytesData: AllQuickBytesType[]; collapsed?: boolean}
export const QuickBytes: React.FC<Props> = ({qBytesData, collapsed = false}) => {
    const content = <List disablePadding>{qBytesData.map((post, index) => <React.Fragment key={post.id}><ListItem alignItems="flex-start"><ListItemAvatar><Avatar sx={{width: 40, height: 40}} alt={post.displayName} src={post.photoURL || undefined}/></ListItemAvatar><ListItemText primary={post.displayName} secondary={<><Typography component="span" variant="body2" color="text.primary">{post.speak}</Typography>{` — ${post.text}`}</>}/></ListItem>{index < qBytesData.length - 1 && <Divider component="li" variant="inset"/>}</React.Fragment>)}</List>
    if (collapsed) return <Accordion disableGutters><AccordionSummary expandIcon={<ExpandMoreIcon/>}><Typography fontWeight={700}>Быстрые сообщения ({qBytesData.length})</Typography></AccordionSummary><AccordionDetails>{content}</AccordionDetails></Accordion>
    return <Card sx={{height: '100%', overflow: 'auto', borderRadius: 2}}>{content}</Card>
}
