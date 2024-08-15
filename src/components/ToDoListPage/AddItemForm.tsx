import React, { ChangeEvent, KeyboardEvent, useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { IconButton, TextField } from '@mui/material'

type AddItemFormPropsType = {
  addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormPropsType) {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onNewTitleChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.currentTarget.value)
  }
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null)
    if (e.key === 'Enter') {
      props.addItem(newTaskTitle)
      setNewTaskTitle('')
    }
  }
  const addTask = () => {
    if (newTaskTitle.trim()) {
      props.addItem(newTaskTitle.trim())
      setNewTaskTitle('')
    } else {
      setError('Field required')
    }
  }

  return (
    <div>
      <TextField value={newTaskTitle} variant='outlined' size='small' label='Type value'
                 onChange={onNewTitleChangeHandler}
                 onKeyDownCapture={onKeyPressHandler}
                 error={!!error}
                 helperText={error}
                 autoComplete='off'
      />
      <IconButton color="primary" onClick={addTask} aria-label="add">
        <AddCircleOutlineIcon/>
      </IconButton>
    </div>
  )
}