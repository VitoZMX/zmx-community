import React, { ChangeEvent } from 'react'
import { Button, ButtonGroup, Checkbox, IconButton, Paper } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ClearIcon from '@mui/icons-material/Clear'
import { EditableSpan } from "./EditableSpan";
import { AddItemForm } from "./AddItemForm";

export type FilterValuesType = 'all' | 'completed' | 'active'

export type TaskType = {
  id: string
  title: string
  isDone: boolean
}

type ToDoListPropsType = {
  title: string
  id: string
  tasks: Array<TaskType> // или TaskType[]
  removeTask: (id: string, todolistId: string) => void
  changeFilter: (value: FilterValuesType, todolistID: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  changeTodolistTitle: (id: string, newTitle: string) => void
  filter: FilterValuesType
  removeToDoList: (todolistId: string) => void
}

export function Todolist(props: ToDoListPropsType) {
  const onAllClickHandler = () => props.changeFilter('all', props.id)
  const onActiveClickHandler = () => props.changeFilter('active', props.id)
  const onCompletedClickHandler = () => props.changeFilter('completed', props.id)
  const removeToDoList = () => props.removeToDoList(props.id)
  const changeTodolistTitle = (newTitle: string) => props.changeTodolistTitle(props.id, newTitle)

  const addTask = (title: string) => {
    props.addTask(title, props.id)
  }

  return (
    <Paper sx={{ p: 1, backgroundColor: "#f6f6f6" }}>
      <div>
        <EditableSpan title={props.title} OnChange={changeTodolistTitle}/>
        <IconButton onClick={removeToDoList} aria-label="delete">
          <DeleteForeverIcon/>
        </IconButton>
      </div>
      <AddItemForm addItem={addTask}/>
      <div>
        {
          props.tasks.map((el) => {
            const onDelTaskClickHandler = () => props.removeTask(el.id, props.id)
            const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) =>
              props.changeTaskStatus(el.id, e.currentTarget.checked, props.id)
            const onChangeTitleHandler = (newValue: string) =>
              props.changeTaskTitle(el.id, newValue, props.id)
            return (
              <div key={el.title} className={el.isDone ? 'is-done' : ''}>
                <Checkbox checked={el.isDone} onChange={onChangeStatusHandler}/>
                <EditableSpan title={el.title} OnChange={onChangeTitleHandler}/>
                <IconButton color="primary" onClick={onDelTaskClickHandler} aria-label="delete">
                  <ClearIcon/>
                </IconButton>
              </div>
            )
          })
        }
      </div>
      <div>
        <ButtonGroup sx={{ mt: 1 }} variant="outlined" aria-label="outlined button group">
          <Button onClick={onAllClickHandler} color='secondary'
                  variant={props.filter === 'all' ? 'contained' : 'outlined'}>All</Button>
          <Button onClick={onActiveClickHandler}
                  variant={props.filter === 'active' ? 'contained' : 'outlined'}>Active</Button>
          <Button onClick={onCompletedClickHandler}
                  variant={props.filter === 'completed' ? 'contained' : 'outlined'}>Completed</Button>
        </ButtonGroup>
      </div>
    </Paper>
  )
}