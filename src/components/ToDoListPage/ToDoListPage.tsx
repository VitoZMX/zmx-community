import React, {useContext, useEffect, useState} from 'react'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {Context} from '../../App'
import {FilterValuesType, TaskType, Todolist} from './ToDoList'
import {AddItemForm} from './AddItemForm'

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
type ToDoListType = {id: string; title: string; filter: FilterValuesType}
type TasksStateType = Record<string, TaskType[]>

const initialData = () => {
    const ids = [createId(), createId(), createId()]
    return {
        lists: [{id: ids[0], title: 'Мой список 1', filter: 'all' as FilterValuesType}, {id: ids[1], title: 'Нужное', filter: 'active' as FilterValuesType}, {id: ids[2], title: 'Что купить', filter: 'completed' as FilterValuesType}],
        tasks: {
            [ids[0]]: [{id: createId(), title: 'CSS', isDone: true}, {id: createId(), title: 'HTML', isDone: false}, {id: createId(), title: 'JS', isDone: true}, {id: createId(), title: 'React', isDone: true}],
            [ids[1]]: [{id: createId(), title: 'Milk', isDone: false}, {id: createId(), title: 'Beer', isDone: true}, {id: createId(), title: 'Meet', isDone: true}],
            [ids[2]]: [{id: createId(), title: 'Вода', isDone: true}, {id: createId(), title: 'Хлеб', isDone: false}, {id: createId(), title: 'Молоко', isDone: true}, {id: createId(), title: 'Торт', isDone: true}]
        } as TasksStateType
    }
}

export function ToDoListPage() {
    const {user, firestore} = useContext(Context)
    const [todolists, setTodoList] = useState<ToDoListType[]>([])
    const [tasksObj, setTasksObj] = useState<TasksStateType>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) return
        const load = async () => {
            const snapshot = await getDoc(doc(firestore, 'users', user.uid))
            const data = snapshot.data() as {todoLists?: ToDoListType[]; todoTasks?: TasksStateType} | undefined
            if (data?.todoLists?.length && data.todoTasks) { setTodoList(data.todoLists); setTasksObj(data.todoTasks) }
            else { const defaults = initialData(); setTodoList(defaults.lists); setTasksObj(defaults.tasks); await persist(defaults.lists, defaults.tasks) }
            setLoading(false)
        }
        load().catch(() => {setError('Не удалось загрузить списки задач'); setLoading(false)})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, firestore])

    const persist = async (lists: ToDoListType[], tasks: TasksStateType) => {
        if (!user) return
        setSaving(true)
        try { await setDoc(doc(firestore, 'users', user.uid), {todoLists: lists, todoTasks: tasks}, {merge: true}) }
        finally { setSaving(false) }
    }
    const update = (lists: ToDoListType[], tasks: TasksStateType) => { setTodoList(lists); setTasksObj(tasks); void persist(lists, tasks) }

    const addTask = (title: string, listId: string) => update(todolists, {...tasksObj, [listId]: [{id: createId(), title: title || 'Новая задача', isDone: false}, ...(tasksObj[listId] || [])]})
    const changeStatus = (taskId: string, isDone: boolean, listId: string) => update(todolists, {...tasksObj, [listId]: (tasksObj[listId] || []).map(task => task.id === taskId ? {...task, isDone} : task)})
    const changeTaskTitle = (taskId: string, title: string, listId: string) => update(todolists, {...tasksObj, [listId]: (tasksObj[listId] || []).map(task => task.id === taskId ? {...task, title: title.trim() || task.title} : task)})
    const changeList = (id: string, changes: Partial<ToDoListType>) => update(todolists.map(list => list.id === id ? {...list, ...changes} : list), tasksObj)
    const removeTask = (taskId: string, listId: string) => update(todolists, {...tasksObj, [listId]: (tasksObj[listId] || []).filter(task => task.id !== taskId)})
    const removeList = (listId: string) => { const tasks = {...tasksObj}; delete tasks[listId]; update(todolists.filter(list => list.id !== listId), tasks) }
    const addList = (title: string) => { const list = {id: createId(), title, filter: 'all' as FilterValuesType}; update([list, ...todolists], {...tasksObj, [list.id]: []}) }

    if (loading) return <Container maxWidth="xl" sx={{mt: 10}}><Grid container spacing={2}>{[1, 2, 3].map(item => <Grid item xs={12} sm={6} md={4} key={item}><Skeleton variant="rounded" height={440}/></Grid>)}</Grid></Container>
    return <Container maxWidth="xl" sx={{mt: 10, mb: 6}}>{error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
        <Grid container spacing={2}>
            <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between"><AddItemForm addItem={addList}/>{saving && <Typography variant="caption">Сохранение...</Typography>}</Grid>
            <Grid item xs={12}><Typography color="text.secondary">Изменения сохраняются автоматически в вашем профиле.</Typography></Grid>
            {todolists.map(list => <Grid item xs={12} sm={6} md={4} lg={3} key={list.id}><Todolist title={list.title} id={list.id} tasks={(tasksObj[list.id] || []).filter(task => list.filter === 'all' || (list.filter === 'active' ? !task.isDone : task.isDone))} removeTask={removeTask} changeFilter={(filter, id) => changeList(id, {filter})} addTask={addTask} changeTaskStatus={changeStatus} changeTaskTitle={changeTaskTitle} filter={list.filter} changeTodolistTitle={(id, title) => changeList(id, {title})} removeToDoList={removeList}/></Grid>)}
        </Grid>
    </Container>
}
