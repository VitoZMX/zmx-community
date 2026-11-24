import React, {ChangeEvent} from 'react'
import {Button, ButtonGroup, Checkbox, IconButton, Paper, Stack, Box} from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ClearIcon from '@mui/icons-material/Clear'
import {EditableSpan} from './EditableSpan'
import {AddItemForm} from './AddItemForm'

export type FilterValuesType = 'all' | 'completed' | 'active'
export type TaskType = {id: string; title: string; isDone: boolean}
type ToDoListPropsType = {title: string; id: string; tasks: TaskType[]; removeTask: (id: string, listId: string) => void; changeFilter: (value: FilterValuesType, listId: string) => void; addTask: (title: string, listId: string) => void; changeTaskStatus: (taskId: string, done: boolean, listId: string) => void; changeTaskTitle: (taskId: string, title: string, listId: string) => void; changeTodolistTitle: (id: string, title: string) => void; filter: FilterValuesType; removeToDoList: (listId: string) => void}

export function Todolist(props: ToDoListPropsType) {
    return <Paper elevation={3} sx={{p: 2, height: 440, display: 'flex', flexDirection: 'column', borderRadius: 2}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{minHeight: 44}}><EditableSpan title={props.title} OnChange={title => props.changeTodolistTitle(props.id, title)}/><IconButton onClick={() => props.removeToDoList(props.id)} aria-label="Удалить список"><DeleteForeverIcon/></IconButton></Stack>
        <Box sx={{mb: 1}}><AddItemForm addItem={title => props.addTask(title, props.id)}/></Box>
        <Box sx={{flex: 1, minHeight: 0, overflowY: 'auto', pr: .5}}>{props.tasks.map(task => <Stack direction="row" alignItems="center" key={task.id} sx={{minHeight: 42, borderBottom: '1px solid', borderColor: 'divider'}}><Checkbox checked={task.isDone} onChange={(e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(task.id, e.target.checked, props.id)}/><Box sx={{flex: 1, overflow: 'hidden', textDecoration: task.isDone ? 'line-through' : 'none'}}><EditableSpan title={task.title} OnChange={title => props.changeTaskTitle(task.id, title, props.id)}/></Box><IconButton size="small" color="primary" onClick={() => props.removeTask(task.id, props.id)} aria-label="Удалить задачу"><ClearIcon/></IconButton></Stack>)}</Box>
        <ButtonGroup fullWidth sx={{mt: 1}} variant="outlined" size="small"><Button onClick={() => props.changeFilter('all', props.id)} variant={props.filter === 'all' ? 'contained' : 'outlined'}>Все</Button><Button onClick={() => props.changeFilter('active', props.id)} variant={props.filter === 'active' ? 'contained' : 'outlined'}>Активные</Button><Button onClick={() => props.changeFilter('completed', props.id)} variant={props.filter === 'completed' ? 'contained' : 'outlined'}>Готовые</Button></ButtonGroup>
    </Paper>
}
