import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {FirebaseUserAndUserType} from '../App'
import React from 'react'

export type ThemeMode = 'default' | 'dark' | 'custom' | 'ocean' | 'sunset' | 'forest'
export type ThemeSettings = { primary: string; secondary: string; background: string; surface: string; mode: ThemeMode }
export const defaultThemeSettings: ThemeSettings = {primary: '#1976d2', secondary: '#9c27b0', background: '#e0e5ea', surface: '#ffffff', mode: 'default'}
export type UserRole = 'admin' | 'journalist' | 'moderator' | 'user' | 'guest' | 'vip'
export type RolePermissions = {comment: boolean; createNews: boolean; approveNews: boolean}
export type RolePermissionsMap = Record<UserRole, RolePermissions>
export type ContextType = { auth: ReturnType<typeof getAuth>; firestore: ReturnType<typeof getFirestore>; user: FirebaseUserAndUserType | null; setUser: (user: FirebaseUserAndUserType | null) => void; userFriends: userType[]; setUserFriends: (userFriends: userType[]) => void; rolePermissions: RolePermissionsMap; setRolePermissions: (permissions: RolePermissionsMap) => void }
export type userType = { uid: string; displayName: string; email?: string | null; age?: string | null; country?: string | null; sex?: string | null; aboutYou?: string | null; barkMode?: boolean; photoURL?: string | null; role?: UserRole | string; permissions?: RolePermissionsMap; metadata?: {creationTime?: string; lastSignInTime?: string}; friends: string[]; qBPostsId?: string[]; theme?: ThemeSettings }
export type NewsCommentType = { id: string; newsId: string; text: string; userId: string; authorName: string; authorPhotoURL?: string | null; createdAt: {seconds: number} | null; updatedAt?: {seconds: number} | null; likeCount: number; dislikeCount: number; currentReaction?: 'like' | 'dislike' }
export type NewsAddMessagesType = { id: string; img: string; title: string; MaxText: string; MinText: string; createdAt: {seconds: number} | null; updatedAt?: {seconds: number} | null; userId: string; authorName?: string; authorPhotoURL?: string | null; isPublic?: boolean; status?: 'draft' | 'published'; firstPublishedAt?: {seconds: number} | null; approvedAt?: {seconds: number} | null; approvedBy?: string; approvedByName?: string; approvedByPhotoURL?: string | null; commentCount?: number; likeCount?: number; dislikeCount?: number }
export type MessageTypeProps = {photoURL: string; displayName: string; message: string; seconds: number | null; idMessage: string; userId?: string; canEdit?: boolean; onEdit: (id: string, message: string) => Promise<void>}

export type CartNewsPropsType = {img: string; title: string; text: string; id: string}
export type ChatMessageType = {id: string; photoURL: string; displayName: string; message: string; createdAt: {seconds: number} | null; userId: string}
export type quickBytesType = {id: string; createdAt: {seconds: number}; text: string; userId: string; speak: string}
export type FriendsTabPanelPropsType = {children?: React.ReactNode; index: number; value: number}
export type AllQuickBytesType = quickBytesType & userType
