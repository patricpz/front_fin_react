# 💰 Sistema Financeiro Pessoal — Web Mobile First

## 📖 Sobre o Projeto

Aplicação Web Mobile First para **controle financeiro pessoal**, com aparência e experiência semelhante a um aplicativo nativo, permitindo acesso por qualquer dispositivo (Android, iPhone, Tablet e Desktop) diretamente pelo navegador.

O sistema permite ao usuário controlar receitas, despesas, contas, cartões, metas e ter uma visão clara da sua saúde financeira, com gráficos e relatórios.

O sistema será desenvolvido priorizando:

* Design Mobile First
* Alta performance
* Responsividade
* Escalabilidade
* Código limpo
* Componentização
* Boa experiência do usuário (UX)
* Segurança de dados financeiros

---

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env` (já configurado para o backend FastAPI em `http://localhost:8000/api/v1`) e ajuste se necessário.

Com o backend rodando (`docker-compose up -d` na pasta do backend), acesse `http://localhost:5173`. Com `VITE_USE_MOCK=false`, o app consome a API real; com `true`, usa dados mock sem backend.

---

# 🎯 Objetivos

* Desenvolver uma aplicação moderna de controle financeiro pessoal.
* Funcionar perfeitamente em smartphones.
* Ser instalável como PWA.
* Consumir APIs REST.
* Possuir autenticação segura.
* Permitir cadastro de receitas, despesas, contas e cartões.
* Exibir dashboards e relatórios financeiros claros.
* Ser facilmente escalável.

---

# 🏗 Arquitetura

```
Frontend
     │
     ▼
API REST
     │
     ▼
Banco de Dados
```

---

# 🧩 Módulos do Sistema

## 1. Autenticação
* Login / Cadastro
* Recuperação de senha
* Autenticação via JWT
* Refresh Token
* (Opcional) Login social (Google)

## 2. Dashboard
* Saldo total (todas as contas)
* Receitas do mês
* Despesas do mês
* Saldo previsto (considerando lançamentos futuros)
* Gráfico de despesas por categoria
* Gráfico de evolução mensal (receitas x despesas)
* Últimas transações

## 3. Transações (Receitas e Despesas)
* Cadastro de transação (valor, data, categoria, conta, descrição, anexo/comprovante)
* Transações recorrentes (fixas mensais, semanais, anuais)
* Transações parceladas
* Edição e exclusão
* Marcar como "pago/recebido" ou "pendente"
* Filtros (por período, categoria, conta, tipo)
* Busca por descrição

## 4. Categorias
* Categorias padrão (Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Salário, etc.)
* Criação de categorias personalizadas
* Ícones e cores por categoria
* Subcategorias (opcional)

## 5. Contas
* Múltiplas contas (Carteira, Conta Corrente, Poupança, Investimentos)
* Saldo individual por conta
* Transferência entre contas
* Histórico por conta

## 6. Cartões de Crédito
* Cadastro de cartões (limite, fechamento, vencimento)
* Lançamento de compras no cartão
* Fatura atual e faturas futuras (parcelamentos)
* Limite disponível
* Marcar fatura como paga

## 7. Orçamento (Budget)
* Definir limite de gasto por categoria/mês
* Barra de progresso (gasto atual x limite)
* Alertas ao se aproximar ou ultrapassar o limite

## 8. Metas Financeiras
* Criar metas (ex: "Viagem", "Reserva de emergência")
* Valor alvo e prazo
* Progresso da meta
* Aportes manuais para a meta

## 9. Relatórios
* Relatório por período
* Relatório por categoria
* Comparativo mês a mês
* Exportação em PDF
* Exportação em Excel/CSV

## 10. Perfil do Usuário
* Dados pessoais
* Alterar senha
* Preferências (moeda, tema claro/escuro)
* Notificações

---

# 🚀 Tecnologias

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* TanStack Query
* React Hook Form
* Zod
* Framer Motion
* React Icons
* Lucide React

## UI

* Tailwind CSS
* shadcn/ui
* Radix UI

## Estado Global

Escolher apenas um:

* Zustand (Recomendado)
  ou
* Context API

## Consumo de API

* Axios
* TanStack Query

## Validação

* React Hook Form
* Zod

## Ícones

* Lucide React

## Notificações

* Sonner

## Gráficos

* Recharts *(essencial — não opcional neste projeto)*

## Datas

* date-fns

## Formatação monetária

* Intl.NumberFormat (nativo) ou `currency.js`

## Upload de comprovantes

* React Dropzone

## PWA

* vite-plugin-pwa

## Qualidade de Código

* ESLint
* Prettier
* Husky
* lint-staged

## Testes (Opcional)

* Vitest
* React Testing Library

---

# 📂 Estrutura do Projeto

```
src
│
├── assets
│
├── components
│   ├── common
│   ├── forms
│   ├── layout
│   ├── charts
│   └── ui
│
├── contexts
│
├── hooks
│
├── layouts
│
├── pages
│   ├── auth
│   ├── dashboard
│   ├── transactions
│   ├── accounts
│   ├── cards
│   ├── categories
│   ├── budget
│   ├── goals
│   ├── reports
│   └── profile
│
├── routes
│
├── services
│   ├── api.ts
│   └── endpoints.ts
│
├── store
│
├── types
│
├── utils
│   ├── formatCurrency.ts
│   └── calculations.ts
│
├── constants
│
├── styles
│
├── App.tsx
│
└── main.tsx
```

---

# 🗄 Modelo de Dados (sugestão inicial)

```
User
 ├── id, name, email, password, currency, theme

Account
 ├── id, userId, name, type (carteira/corrente/poupança/investimento), balance

Card
 ├── id, userId, name, limit, closingDay, dueDay

Category
 ├── id, userId, name, type (receita/despesa), color, icon

Transaction
 ├── id, userId, accountId, cardId (opcional), categoryId
 ├── type (receita/despesa), amount, date, description
 ├── status (pago/pendente), recurring (bool), installments (int)

Budget
 ├── id, userId, categoryId, month, limitAmount

Goal
 ├── id, userId, title, targetAmount, currentAmount, deadline
```

---

# 📱 Mobile First

Todo o desenvolvimento deverá iniciar considerando telas pequenas.

Largura base:

```
375px
```

Depois expandir para:

```
640px
768px
1024px
1280px
1536px
```

Nunca desenvolver pensando primeiro em Desktop.

---

# 🎨 Design

Utilizar:

* Bordas arredondadas
* Sombras suaves
* Espaçamento consistente
* Ícones minimalistas
* Cores acessíveis
* Verde para receitas / Vermelho para despesas (padrão financeiro)
* Componentes reutilizáveis
* Gráficos simples e legíveis

---

# 📦 Instalação

Criar o projeto:

```bash
npm create vite@latest
```

Escolher:

```
React
TypeScript
```

Entrar na pasta:

```bash
cd projeto
```

Instalar dependências:

```bash
npm install
```

---

# ⚙ Instalar Tailwind

```bash
npm install tailwindcss @tailwindcss/vite
```

Configurar conforme documentação oficial.

---

# 📦 Instalar dependências

```bash
npm install react-router-dom

npm install axios

npm install @tanstack/react-query

npm install react-hook-form

npm install zod

npm install @hookform/resolvers

npm install framer-motion

npm install lucide-react

npm install sonner

npm install date-fns

npm install zustand

npm install react-dropzone

npm install recharts
```

---

# 📦 Instalar Shadcn/UI

```bash
npx shadcn@latest init
```

Componentes recomendados para este projeto:

```
Button
Input
Card
Dialog
Drawer
Sheet
Toast
Table
Tabs
Badge
Avatar
Dropdown Menu
Alert Dialog
Select
Progress
Calendar
Popover
Chart (wrapper Recharts)
```

---

# 🌐 Configuração da API

Criar:

```
services/api.ts
```

Responsável por:

* Base URL
* Interceptors
* Tokens
* Refresh Token

---

# 🔐 Autenticação

Fluxo recomendado:

```
Login

↓

Recebe JWT

↓

Salva Token

↓

Rotas Protegidas

↓

Refresh Token
```

---

# 📱 PWA

Instalar:

```bash
npm install vite-plugin-pwa
```

Permitir:

* Instalação
* Offline (visualizar últimas transações sincronizadas)
* Splash Screen
* Ícone
* Manifest

---

# 🚀 Build

Desenvolvimento

```bash
npm run dev
```

Produção

```bash
npm run build
```

Preview

```bash
npm run preview
```

---

# ☁ Deploy

Opções recomendadas:

* Vercel
* Netlify
* Cloudflare Pages

---

# 📈 Funcionalidades Futuras

* Tema Dark/Light
* Internacionalização (i18n)
* Notificações Push (lembrete de contas a vencer)
* Modo Offline
* Cache Inteligente
* Integração com Open Finance (importar extratos automaticamente)
* Leitura de QR Code/Nota Fiscal para lançar despesas
* Compartilhamento de conta (finanças em casal/família)
* Exportação em PDF
* Exportação em Excel
* IA para categorização automática de despesas
* Previsão de gastos futuros

---

# 📌 Boas Práticas

* Componentes pequenos e reutilizáveis.
* Separação entre UI e regras de negócio.
* Tipagem forte com TypeScript.
* Evitar duplicação de código.
* Padronização de nomes.
* Organização por responsabilidade.
* Responsividade desde o início.
* Commits semânticos (Conventional Commits).
* Uso de variáveis de ambiente para dados sensíveis.
* Nunca expor dados financeiros sensíveis no client sem criptografia/HTTPS.
* Validar todo valor monetário (não permitir negativos indevidos, casas decimais corretas).

---

# 🎯 Objetivo Final

Construir uma aplicação Web Mobile First de **controle financeiro pessoal**, com aparência de aplicativo nativo, rápida, segura, escalável e de fácil manutenção, ajudando o usuário a organizar suas finanças, visualizar seus gastos e alcançar suas metas — tanto em dispositivos móveis quanto em desktops.
# front_fin_react
