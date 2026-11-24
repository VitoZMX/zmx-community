import {UserRole, RolePermissions} from './types/types'

export const roleLabels: Record<UserRole, string> = {
    admin: 'Администратор', journalist: 'Журналист', moderator: 'Модератор', user: 'Пользователь', guest: 'Гость', vip: 'VIP'
}

export const defaultRolePermissions: Record<UserRole, RolePermissions> = {
    admin: {comment: true, createNews: true, approveNews: true},
    journalist: {comment: true, createNews: true, approveNews: false},
    moderator: {comment: true, createNews: false, approveNews: true},
    user: {comment: true, createNews: false, approveNews: false},
    guest: {comment: false, createNews: false, approveNews: false},
    vip: {comment: true, createNews: true, approveNews: false}
}

export const normalizeRole = (role?: string): UserRole => {
    if (role === 'Administrator' || role === 'Admin') return 'admin'
    if (role === 'Journalist') return 'journalist'
    if (role === 'Moderator') return 'moderator'
    if (role === 'VIP') return 'vip'
    if (role === 'Guest') return 'guest'
    return role && Object.prototype.hasOwnProperty.call(roleLabels, role) ? role as UserRole : 'user'
}

export const permissionsFor = (role?: string, configured?: Partial<Record<UserRole, RolePermissions>>): RolePermissions => configured?.[normalizeRole(role)] || defaultRolePermissions[normalizeRole(role)]
