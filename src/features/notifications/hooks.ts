import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchNotifications,
  markNotificationRead,
  readAllNotifications,
  sendNotificationFeedback,
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '@/services/financeApi'

import type { FeedbackAction, NotificationItem, NotificationPage, NotificationPreferences } from '@/types'

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
}

export function useNotifications() {
  return useInfiniteQuery<NotificationPage>({
    queryKey: notificationKeys.list(),
    queryFn: ({ pageParam }) =>
      fetchNotifications({ cursor: pageParam as string | null, limit: 20 }),
    initialPageParam: null,
    getNextPageParam: (last) => last.next_cursor,
  })
}

/** Badge do sino: consulta leve, atualiza a cada 60s. */
export function useUnreadCount() {
  return useQuery<NotificationPage, Error, number>({
    queryKey: notificationKeys.unread(),
    queryFn: () => fetchNotifications({ limit: 1 }),
    select: (data) => data.unread_count,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => markNotificationRead(id),
    onSettled: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export function useFeedback() {
  const qc = useQueryClient()
  return useMutation<void, Error, { id: string; action: FeedbackAction }, { prev: unknown }>({
    mutationFn: ({ id, action }) => sendNotificationFeedback(id, action),
    onMutate: async ({ id, action }) => {
      // Atualização otimista: dispensar remove visualmente da lista.
      await qc.cancelQueries({ queryKey: notificationKeys.list() })
      const prev = qc.getQueryData(notificationKeys.list())
      if (action === 'dismissed') {
        qc.setQueryData(notificationKeys.list(), (old: unknown) => {
          if (!old) return old
          const data = old as { pages: NotificationPage[] }
          return {
            ...data,
            pages: data.pages.map((p) => ({
              ...p,
              items: p.items.filter((n) => n.id !== id),
            })),
          }
        })
      }
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(notificationKeys.list(), ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation<void, Error, void>({
    mutationFn: () => readAllNotifications(),
    onSettled: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  })
}

export function usePreferences() {
  return useQuery<NotificationPreferences>({
    queryKey: ['notification-preferences'],
    queryFn: () => fetchNotificationPreferences(),
  })
}

export function useUpdatePreferences() {
  const qc = useQueryClient()
  return useMutation<NotificationPreferences, Error, NotificationPreferences>({
    mutationFn: (data) => updateNotificationPreferences(data),
    onSuccess: (data) => {
      qc.setQueryData(['notification-preferences'], data)
      qc.invalidateQueries({ queryKey: ['notification-preferences'] })
    },
  })
}

export type { NotificationItem, NotificationPage, FeedbackAction }