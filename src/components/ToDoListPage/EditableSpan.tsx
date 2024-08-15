import React, { ChangeEvent, useState } from 'react'
import { TextField } from '@mui/material'
import Typography from '@mui/material/Typography'

type EditableSpanPropsType = {
  title: string
  OnChange: (newValue: string) => void
}

export function EditableSpan(props: EditableSpanPropsType) {
  let [editMode, setEditMode] = useState(false)
  let [title, setTitle] = useState('')

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(props.title)
  }
  const activateViewMode = () => {
    setEditMode(false)
    props.OnChange(title)
  }
  const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

  return editMode
    ?
    <TextField size='small' autoFocus value={title} onChange={onChangeTitleHandler} onBlur={activateViewMode}/>
    :
    <Typography variant="body1" component="span" onDoubleClick={activateEditMode}>{props.title}</Typography>
}