# AppSupermercado — MVP V1

Aplicação web moderna de lista de compras partilhada entre membros da mesma família, desenvolvida com foco em usabilidade dentro do supermercado (mobile-first), inspirada no visual limpo de aplicações como **Todoist** e **Bring!**.

---

## 🎨 Paleta de Cores e Design

* **Verde Principal:** `#2E7D32` (Frescura, sustentabilidade e clareza visual)
* **Verde Claro:** `#E8F5E9` (Destaques, estados ativos e badges)
* **Branco:** `#FFFFFF` (Superfícies de cartões e modais)
* **Cinza Muito Claro:** `#F8FAFC` (Fundo relaxante de alto contraste)

---

## 🚀 Funcionalidades do MVP V1

* **Dashboard Inicial:**
  * Cartões de métricas: *Produtos por comprar*, *Produtos comprados*, *Percentagem de conclusão* e *Total de itens*.
  * Barra de progresso visual interativa.
  * Distribuição de itens por categorias.
  * Atividade recente da família (quem adicionou e quem comprou artigos, com indicação de tempo relativo em Português).
* **Lista de Compras Partilhada:**
  * Cartões com Nome, Quantidade, Categoria, Quem adicionou e Estado (*Comprado* / *Por comprar*).
  * Checkbox grande e acessível com feedback instantâneo para marcar compras no supermercado.
  * Ajuste rápido de quantidades (`+` / `-`).
  * Pesquisa em tempo real (por nome ou notas).
  * Filtro por categoria (Enum fixo de 10 categorias).
  * Filtros de estado (*Todos*, *Por comprar*, *Comprados*).
  * Ação rápida para limpar artigos comprados.
* **Adição de Produtos:**
  * Modal rápido com Nome, Quantidade, Unidade, Seleção visual de Categoria com emojis e Notas opcionais.
  * Utilizador atual pré-definido como **Glaucia**, com suporte para alternar para outros familiares.
* **Simulação Familiar & Persistência:**
  * Gestão de membros da família (Glaucia, Miguel, Beatriz).
  * Persistência total em `localStorage` (os dados mantêm-se após atualizar a página).
  * Botão na barra de navegação para restaurar os dados de demonstração a qualquer momento.
* **Preparação para Supabase:**
  * Interface agnóstica `IShoppingService`.
  * `LocalShoppingService` para armazenamento local sem dependências externas.
  * `SupabaseShoppingService` e `supabase/schema.sql` prontos para migração para a nuvem sem alterar páginas ou componentes.

---

## 📂 Estrutura de Pastas

```
App_supermarket/
├── public/                 # Assets estáticos
├── supabase/
│   └── schema.sql          # Esquema SQL completo com RLS para futura ligação ao Supabase
├── src/
│   ├── assets/             # Logótipo SVG e recursos visuais
│   │   └── logo.svg
│   ├── components/         # Componentes React reutilizáveis e modulares
│   │   ├── common/         # Componentes base (Button, Input, Modal, Badge)
│   │   ├── dashboard/      # Cartões de estatísticas, barra de progresso e categorias
│   │   ├── layout/         # Header, BottomNav mobile e UserSwitcherModal
│   │   └── shopping/       # Cartões de itens, filtros, modal de adição e empty states
│   ├── hooks/              # Custom Hooks React
│   │   ├── useFamily.ts    # Gestão de utilizador ativo (Glaucia) e membros
│   │   └── useShoppingList.ts # Lógica da lista de compras, filtros e mutações
│   ├── pages/              # Páginas principais
│   │   ├── DashboardPage.tsx
│   │   └── ShoppingListPage.tsx
│   ├── services/           # Camada de abstração e persistência de dados
│   │   ├── types.ts        # Interface IShoppingService
│   │   ├── mockData.ts     # Dados iniciais realistas de supermercado português
│   │   ├── localShoppingService.ts # Implementação localStorage
│   │   ├── supabaseClient.ts # Deteção e configuração Supabase
│   │   ├── supabaseShoppingService.ts # Esqueleto de serviço Supabase para V2
│   │   └── index.ts        # Fábrica de seleção de serviço
│   ├── types/              # Definições de tipos TypeScript
│   │   └── shopping.ts     # Modelos Family, User, ShoppingItem e Enum Category
│   ├── utils/              # Funções utilitárias
│   │   ├── cn.ts           # Concatenação de classes Tailwind
│   │   └── formatters.ts   # Datas em pt-PT e metadados visuais de categorias
│   ├── App.tsx             # Componente raiz
│   ├── main.tsx            # Ponto de entrada React
│   └── index.css           # Estilos globais e diretivas Tailwind
├── index.html              # Ficheiro HTML raiz com meta tags mobile
├── tailwind.config.js      # Configuração de temas e cores da marca
├── vite.config.ts          # Configuração do Vite
└── package.json            # Dependências do projeto
```

---

## 🛠️ Como Executar o Projeto

1. **Instalar as dependências** (se ainda não o fizeste):
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:**
   Acede a [http://localhost:5173](http://localhost:5173).

4. **Para gerar a versão de produção:**
   ```bash
   npm run build
   ```
