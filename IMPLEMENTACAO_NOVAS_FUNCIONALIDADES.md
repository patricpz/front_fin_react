# Resumo da Implementação — Novas Funcionalidades Frontend

## Visão Geral
Implementação completa das funcionalidades descritas no `GUIA_FRONTEND_NOVAS_FUNCIONALIDADES.md` para o app de finanças pessoais (Vite + React 19 + TypeScript + Tailwind v4 + TanStack Query v5).

---

## 1. Módulo: Despesas Parceladas (`/parcelas`)

### Página: `src/pages/installments/InstallmentsPage.tsx`
- **Listagem** de despesas parceladas usando o componente `InstallmentCard` existente
- **Cards de progresso** com barra visual, valor pago/restante, próximas parcelas
- **Botão "Registrar pagamento de parcela"** chama `PATCH /expenses/{id}/installments/pay`
- **Estado vazio** com call-to-action para cadastrar primeira despesa
- **Modal de criação** (preparado para `POST /expenses/installments`)

### Hook: `src/hooks/useInstallments.ts`
- `useInstallments()` — `useQuery` para `GET /expenses/installments`
- `usePayInstallment()` — `useMutation` para `PATCH /expenses/{id}/installments/pay`

### Query Keys: `src/lib/queryKeys.ts`
- Adicionado `installments: { list: () => ['installments'] }`

### Rota: `/parcelas` (protegida)
- Adicionado em `src/constants/index.ts` e `src/routes/index.tsx`

---

## 2. Central de Notificações (Sino + Painel)

### Bell de Notificações: `src/features/notifications/NotificationBell.tsx`
- Badge com contador `unread_count` (atualiza a cada 60s via `useUnreadCount`)
- Clique abre `NotificationPanel` via store Zustand

### Painel Lateral: `src/features/notifications/NotificationPanel.tsx`
- **Slide-over** (mobile) / **Drawer** (desktop) com `z-index` alto
- Lista infinita com `useInfiniteQuery` + cursor opaco
- **Ações por item**: abrir (marca lida + `feedback: opened`), útil, não útil, dispensar
- Header com "Marcar todas" e link para Preferências
- Integração com `NotificationPreferencesDialog` (modal interno)

### Lista e Item: `NotificationList.tsx` + `NotificationItem.tsx`
- Renderização de `title`, `body`, `created_at` (relativo), badge "não lida"
- Botões de feedback com atualização otimista (`dismissed` remove da lista)

### Store: `src/store/notificationStore.ts`
- Zustand store simples para sincronizar abertura/fechamento do painel entre layouts mobile e web

### Integração nos Layouts
- `MobileLayout.tsx` e `WebLayout.tsx` incluem `<NotificationPanel />` controlado pelo store
- `Header.tsx` e `WebHeader.tsx` usam `<NotificationBell />` no lugar do ícone estático

---

## 3. Preferências de Notificação

### Componente: `src/features/notifications/NotificationPreferences.tsx`
- **Tipos de alerta** (checkboxes): overspending, spending_spike, installment_due, tip, summary
- **Canais**: in-app, push
- **Sensibilidade**: low / medium / high (radio)
- **Horário silencioso**: time inputs (início/fim)
- **Limite diário**: number input (1-100)
- Salvamento automático via `useUpdatePreferences` (PUT `/notification-preferences`)

### Integração no Perfil: `src/pages/profile/ProfilePage.tsx`
- Nova seção "Preferências de Notificação" com o componente acima
- Nova seção "Notificações Push" com `ActivateAlertsButton`

---

## 4. Web Push (VAPID) + iOS Banner

### Ativação: `src/features/push/ActivateAlertsButton.tsx`
- Verifica suporte + permissão (`Notification.requestPermission`)
- iOS PWA: exibe `IosInstallBanner` se não estiver em standalone
- Chama `subscribeToPush()` → `GET /push/public-key` + `POST /push/subscriptions`
- Feedback visual: "Alertas ativados" (disabled verde) ou botão "Ativar alertas"

### iOS Install Banner: `src/features/push/IosInstallBanner.tsx`
- Banner fixo no bottom com instruções "Compartilhar → Adicionar à Tela de Início"
- Dismiss persiste no `localStorage` por 7 dias
- Injetado no root do app via `src/App.tsx`

### Permissão: `src/features/push/usePushPermission.ts`
- Hook com `status`, `isStandalone`, `isIOS`, `requestPermission()`

### Service Worker: `src/sw/sw.ts`
- Handlers `push` e `notificationclick` com tipos corretos (`ServiceWorkerGlobalScope`, `PushEvent`, `NotificationEvent`, `Clients`)
- Workbox manifest injection via `self.__WB_MANIFEST`

---

## 5. Arquivos Criados/Modificados

### Novos Arquivos
| Arquivo | Descrição |
|---------|-----------|
| `src/pages/installments/InstallmentsPage.tsx` | Página de despesas parceladas |
| `src/hooks/useInstallments.ts` | Hooks TanStack Query para parcelas |
| `src/store/notificationStore.ts` | Store Zustand para painel de notificações |

### Arquivos Modificados
| Arquivo | Alterações |
|---------|------------|
| `src/constants/index.ts` | Rotas `INSTALLMENTS`, `NOTIFICATION_PREFERENCES` |
| `src/routes/index.tsx` | Rota `/parcelas` protegida |
| `src/lib/queryKeys.ts` | Chave `installments.list` |
| `src/components/layout/Header.tsx` | Usa `NotificationBell` |
| `src/components/layout/WebHeader.tsx` | Usa `NotificationBell` |
| `src/layouts/MobileLayout.tsx` | Inclui `NotificationPanel` via store |
| `src/layouts/WebLayout.tsx` | Inclui `NotificationPanel` via store |
| `src/features/notifications/NotificationBell.tsx` | Abre painel via store |
| `src/pages/profile/ProfilePage.tsx` | Adiciona `NotificationPreferences` + `ActivateAlertsButton` |
| `src/App.tsx` | Adiciona `IosInstallBanner` |
| `src/sw/sw.ts` | Tipos corretos para Service Worker + Workbox manifest |

---

## 6. Testes e Build
- ✅ `npm run build` — Compila sem erros TypeScript
- ✅ `npx vitest run` — 31 testes passando (5 arquivos)
- ✅ PWA service worker gerado corretamente

---

## 7. Próximos Passos (Opcionais)
1. **Criar despesa parcelada** — Implementar `POST /expenses/installments` no modal
2. **Excluir despesa parcelada** — Implementar `DELETE /expenses/{id}/installments`
3. **Correção manual de parcelas** — `PATCH /expenses/{id}/installments` com `paid_installments`
4. **Testes de integração** — Para fluxos de notificação e push
5. **Página dedicada de preferências** — Em `/preferencias/notificacoes` (rota já reservada)