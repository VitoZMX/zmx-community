import React, { useContext, useState } from 'react'
import Grid from '@mui/material/Grid'
import { useAuthState } from 'react-firebase-hooks/auth'
import Container from "@mui/material/Container";
import { Context } from "../../App";
import { v1 } from "uuid";
import { FilterValuesType, TaskType, Todolist } from "./ToDoList";
import { AddItemForm } from "./AddItemForm";
import Typography from "@mui/material/Typography";

export function ToDoListPage() {
  const { auth } = useContext(Context)
  const [user] = useAuthState(auth)

  type ToDoListType = {
    id: string
    title: string
    filter: FilterValuesType
  }

  type TasksStateType = {
    [key: string]: Array<TaskType>
  }

  function addTask(title: string, todolistId: string) {
    let newTask = { id: v1(), title: title || 'Default Name Task', isDone: false }
    let tasks = tasksObj[todolistId]
    let newTasks = [newTask, ...tasks]
    tasksObj[todolistId] = newTasks
    setTasksObj({ ...tasksObj })
  }

  function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
    let tasks = tasksObj[todolistId]
    let task = tasks.find(p => p.id === taskId)

    if (task) {
      task.isDone = isDone
      setTasksObj({ ...tasksObj })
    }

  }

  function changeTaskTitle(taskId: string, newTitle: string, todolistId: string) {
    let tasks = tasksObj[todolistId]
    let task = tasks.find(p => p.id === taskId)

    if (task) {
      task.title = newTitle
      setTasksObj({ ...tasksObj })
    }
  }

  function changeTodolistTitle(id: string, newTitle: string) {
    const todolist = todolists.find(tl => tl.id === id)
    if (todolist) {
      todolist.title = newTitle
      setTodoList([...todolists])
    }
  }

  function removeTask(taskId: string, todolistId: string) {
    let tasks = tasksObj[todolistId]
    let filteredTasks = tasks.filter(el => el.id !== taskId)
    tasksObj[todolistId] = filteredTasks
    setTasksObj({ ...tasksObj })
  }

  function changeFilter(value: FilterValuesType, todolistID: string) {
    let todolist = todolists.find(tl => tl.id === todolistID)
    if (todolist) {
      todolist.filter = value
    }
    setTodoList([...todolists])
  }

  function removeToDoList(todolistId: string) {
    let filteredTodolist = todolists.filter(el => el.id !== todolistId)
    setTodoList(filteredTodolist)

    delete tasksObj[todolistId]
    setTasksObj({ ...tasksObj })
  }

  let todolistId1 = v1()
  let todolistId2 = v1()
  let todolistId3 = v1()

  let [todolists, setTodoList] = useState<Array<ToDoListType>>([
    { id: todolistId1, title: 'Мой список 1', filter: 'all' },
    { id: todolistId2, title: 'Нужное', filter: 'active' },
    { id: todolistId3, title: 'Что купить', filter: 'completed' }
  ])

  let [tasksObj, setTasksObj] = useState<TasksStateType>({
    [todolistId1]: [
      { id: v1(), title: 'CSS', isDone: true },
      { id: v1(), title: 'HTML', isDone: false },
      { id: v1(), title: 'JS', isDone: true },
      { id: v1(), title: 'React', isDone: true }
    ],
    [todolistId2]: [
      { id: v1(), title: 'Milk', isDone: false },
      { id: v1(), title: 'Beer', isDone: true },
      { id: v1(), title: 'Meet', isDone: true }
    ],
    [todolistId3]: [
      { id: v1(), title: 'Вода', isDone: true },
      { id: v1(), title: 'Хлеб', isDone: false },
      { id: v1(), title: 'Молоко', isDone: true },
      { id: v1(), title: 'Торт', isDone: true }
    ],
  })

  function addTodolist(title: string) {
    let todolist: ToDoListType = {
      id: v1(),
      filter: 'all',
      title: title
    }
    setTodoList([todolist, ...todolists])
    setTasksObj({
      ...tasksObj,
      [todolist.id]: []
    })
  }

  return (
    <Container style={{ marginTop: '80px' }}>
      <Grid container spacing={1} alignItems="stretch">

        <Grid container sx={{ mb: 3 }}>
          <AddItemForm addItem={addTodolist}/>
        </Grid>

        <Grid container sx={{ mb: 3 }}>
          <Typography>Страница находится в разработке, созданные заметки не сохранятся и пропадут после обновления
            страницы.</Typography>
        </Grid>

        {
          todolists.map((tl) => {
              let tasksForToDoList = tasksObj[tl.id]

              if (tl.filter === 'completed') {
                tasksForToDoList = tasksForToDoList.filter(el => el.isDone === true)
              }
              if (tl.filter === 'active') {
                tasksForToDoList = tasksForToDoList.filter(el => el.isDone === false)
              }

              return (
                <div style={{ margin: '0rem 1rem 1rem 0rem' }} key={tl.id}>
                  <Todolist
                    title={tl.title}
                    id={tl.id}
                    tasks={tasksForToDoList}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    changeTaskTitle={changeTaskTitle}
                    filter={tl.filter}
                    changeTodolistTitle={changeTodolistTitle}
                    removeToDoList={removeToDoList}/>
                </div>
              )
            }
          )
        }

      </Grid>
    </Container>
  )
}
