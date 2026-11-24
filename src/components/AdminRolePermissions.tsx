import React, {useContext, useEffect, useState} from 'react'
import {Alert, Checkbox, FormControlLabel, Paper, Stack, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material'
import {doc, setDoc} from 'firebase/firestore'
import {Context} from '../App'
import {roleLabels} from '../roles'
import {RolePermissionsMap, UserRole} from '../types/types'

export function AdminRolePermissions() {
    const {firestore, user, rolePermissions, setRolePermissions} = useContext(Context)
    const [permissions, setPermissions] = useState<RolePermissionsMap>(rolePermissions)
    const [error, setError] = useState('')
    const [editingEnabled, setEditingEnabled] = useState(false)
    useEffect(() => { setPermissions(rolePermissions) }, [rolePermissions])
    const update = async (role: UserRole, key: keyof RolePermissionsMap[UserRole], checked: boolean) => { const next = {...permissions, [role]: {...permissions[role], [key]: checked}}; setPermissions(next); setRolePermissions(next); try { await setDoc(doc(firestore, 'config', 'rolePermissions'), next, {merge: true}) } catch { setError('Не удалось сохранить права') } }
    if (user?.role !== 'admin') return null
    return <Paper className="app-panel" sx={{p: 2, mt: 2}}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="h5" gutterBottom>Права ролей</Typography><FormControlLabel control={<Switch checked={editingEnabled} onChange={e => setEditingEnabled(e.target.checked)} />} label={editingEnabled ? 'Редактирование включено' : 'Разблокировать'}/></Stack>{error && <Alert severity="error">{error}</Alert>}<Table size="small"><TableHead><TableRow><TableCell>Роль</TableCell><TableCell>Комментарии</TableCell><TableCell>Создание новостей</TableCell><TableCell>Approve новостей</TableCell></TableRow></TableHead><TableBody>{(Object.keys(roleLabels) as UserRole[]).map(role => <TableRow key={role}><TableCell>{roleLabels[role]}</TableCell>{(['comment', 'createNews', 'approveNews'] as const).map(key => <TableCell key={key}><Checkbox disabled={!editingEnabled} checked={permissions[role][key]} onChange={e => update(role, key, e.target.checked)} inputProps={{'aria-label': `${roleLabels[role]}: ${key}`}}/></TableCell>)}</TableRow>)}</TableBody></Table></Paper>
}
