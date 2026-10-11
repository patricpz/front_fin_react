# Sistema Financeiro Pessoal — Visão Geral

## O que é

Uma aplicação **Web Mobile First** para controle financeiro pessoal com aparência de aplicativo nativo. O sistema permite aos usuários gerenciar receitas, despesas, contas, cartões, metas e visualizar relatórios e gráficos da sua saúde financeira, acessível por qualquer dispositivo (Android, iPhone, Tablet, Desktop) pelo navegador.

## Stack Tecnológica

### Frontend
- **React 19** com TypeScript
- **Vite** como bundler/dev server
- **Tailwind CSS** v4 (utilities-first CSS)
- **React Router DOM** para navegação
- **TanStack React Query** para gerenciamento de dados server-state
- **React Hook Form** + **Zod** para validação de formulários
- **Zustand** para estado global (com persistência)
- **Axios** para consumo de API (com interceptor de refresh token)
- **Framer Motion** para animações
- **Sonner** para notificações toast
- **Recharts** para gráficos financeiros
- **date-fns** para manipulação de datas
- **Lucide React** para ícones

### UI Components
- **shadcn/ui** (baseado em Radix UI) — componentes de interface acessíveis
- **Tailwind CSS** para estilização utility-first

### Backend (API)
- **FastAPI** (Python 3.12+) — framework assíncrono
- **SQLAlchemy 2.x** — ORM assíncrono
- **PostgreSQL** — banco de dados relacional
- **Alembic** — migrations de banco
- **JWT (HS256)** — autenticação com access + refresh tokens
- **Argon2** — hash de senhas
- **Docker** + **docker-compose** — containerização

### PWA
- **vite-plugin-pwa** — suporte a Progressive Web App
- Manifest e service worker para instalação e offline

## Arquitetura

```
Frontend (React + Vite + Tailwind)
      │
      ▼
API REST (FastAPI)
      │
      ▼
Banco de Dados (PostgreSQL)
```

## Funcionalidades Principais

1. **Autenticação**: Login/cadastro com JWT, refresh token, logout
2. **Contas**: Múltiplas contas (carteira, corrente, poupança, investimento, cartão)
3. **Transações**: Cadastro de receitas e despesas, transações recorrentes e parceladas
4. **Categorias**: 10 categorias padrão (7 despesas + 3 receitas) com hierarquia
5. **Orçamentos**: Limites por categoria/mês com alertas
6. **Metas Financeiras**: Metas com valor alvo, prazo e progresso
7. **Relatórios**: Resumo mensal, gastos por categoria, evolução de saldo, orçado vs realizado
8. **Recorrências**: Regras de transações recorrentes (diárias, semanais, mensais, anuais)
9. **Cartões de Crédito**: Gestão de fatos, limites, vencimentos e parcelamentos
10. **PWA**: Instalação, offline, splash screen

## Design Mobile First

- Largura base: **375px**
- Breakpoints: 640px, 768px, 1024px, 1280px, 1536px
- Prioridade no desenvolvimento para telas pequenas antes de expandir para desktop

## Padrões e Boas Práticas

- **Mobile First** — desenvolvimento iniciando em telas pequenas
- **TypeScript** — tipagem forte em todo o código
- **Componentização** — componentes pequenos e reutilizáveis
- **Commits semânticos** (Conventional Commits)
- **Variáveis de ambiente** para configurações sensíveis
- **Validação de valores monetários** — tratamento de Decimal como string
- **Apenas transações confirmadas** afetam saldo e relatórios
- **Soft delete** para contas/categorias com dados vinculados

## Variáveis de Ambiente

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_ORIGIN=http://localhost:8000
VITE_USE_MOCK=false  # "true" para dados mock, "false" para API real
```

## Deploy

- **Vercel**, **Netlify** ou **Cloudflare Pages**
- Configuração via `vercel.json` (rewrites para SPA)

## Scripts Disponíveis

- `dev` — iniciar servidor de desenvolvimento (vite)
- `build` — build para produção (tsc + vite build)
- `lint` — lint com oxlint
- `preview` — preview do build de produção

---

*Projeto iniciado em 2026 — aplicação full-stack de controle financeiro pessoal*