AppSupermercado é uma aplicação familiar que simplifica as compras de supermercado através de listas partilhadas, gestão da despensa e comparação inteligente de preços.
# AppSupermercado

> Documento oficial de visão, estratégia e regras do produto.

**Versão:** 0.1.0 MVP
**Responsáveis:** Glaucia & ChatGPT
**Última atualização:** Sprint 2

---

# 1. Visão do Produto

O **AppSupermercado** é uma aplicação **mobile-first** para famílias, casais e pessoas que partilham as compras da casa.

O objetivo é tornar as compras mais rápidas, colaborativas e organizadas através de listas partilhadas, notificações inteligentes e, futuramente, gestão da despensa e comparação de preços entre supermercados.

**Princípio principal:** A aplicação deve ser extremamente simples de utilizar enquanto o utilizador está dentro do supermercado.

---

# 2. Público-alvo

O produto destina-se principalmente a:

* Casais
* Famílias
* Colegas de casa
* Pessoas que partilham despesas domésticas

---

# 3. Princípios do Produto

## Mobile First

Toda a experiência é desenhada primeiro para telemóvel.

O utilizador deve conseguir utilizar a aplicação com uma mão.

## Simplicidade

A Home nunca deve ficar carregada de informação.

Antes de adicionar qualquer elemento perguntar:

> Isto ajuda o utilizador a comprar mais depressa?

Se a resposta for **não**, pertence a outra página.

## Colaboração

A lista pertence à família.

Cada utilizador possui:

* nome
* avatar
* notificações próprias
* histórico de visualização

---

# 4. Objetivo da Home

A página inicial deve responder apenas a três perguntas:

### 1. Quantos artigos faltam comprar?

Cartão principal: **Por comprar**

### 2. Qual o progresso da lista ativa?

Barra de progresso da compra atual.

### 3. O que aconteceu recentemente?

Atividade recente da família.

Tudo o resto (estatísticas, análises e históricos) pertence a uma página própria.

---

# 5. Dashboard

## Manter

* Cabeçalho
* Saudação personalizada
* Cartão "Por comprar"
* Cartão "Conclusão"
* Cartão "Total de itens"
* Barra de progresso
* Atividade recente

## Remover

### Cartão "Comprados"

**Motivo**

Não existe uma regra de negócio clara.

Esse número ficaria infinito e deixaria de ter significado.

Quando existir um sistema de **sessões de compras arquivadas**, poderá voltar.

---

# 6. Barra de Progresso

A barra representa **apenas a Lista Ativa**.

## Fórmula

Conclusão = Comprados ÷ Total de itens

Exemplo:

* Total: 12
* Comprados: 6
* Resultado: 50%

Quando atingir 100%:

* A compra é considerada concluída.
* A família poderá arquivar essa lista.
* Uma nova lista inicia uma nova sessão.

---

# 7. Lista de Compras

## Funcionalidades atuais

* Pesquisa
* Categorias
* Quantidade
* Unidade
* Notas
* Marcar como comprado
* Identificação de quem adicionou
* Filtros
* Notification Badge

## Categorias atuais

* Lacticínios
* Fruta
* Legumes
* Carne
* Peixe
* Congelados
* Bebidas
* Limpeza
* Higiene
* Outros

## Categorias futuras

* Papelaria
* Perfumaria
* Desporto
* Animais
* Bebé

No futuro cada família poderá criar categorias personalizadas.

---

# 8. Notificações

## Objetivo

Notificar sem interromper.

Não utilizar banners nem pop-ups.

## Regras

* Badge vermelho
* Apenas mostra artigos novos
* Nunca mostra pendentes
* Cada utilizador possui o seu próprio contador
* Abrir a Lista marca tudo como visualizado

## Localização

* Header
* Dashboard
* Bottom Navigation

---

# 9. Estatísticas (Página futura)

A Home não terá análises.

Será criado um separador próprio chamado **Estatísticas**.

## Indicadores futuros

* Gasto mensal
* Produtos mais comprados
* Categorias mais utilizadas
* Supermercado favorito
* Poupança obtida
* Evolução de despesas

---

# 10. Arquitetura Técnica

## Tecnologias

* React
* TypeScript
* Vite
* Tailwind CSS
* Supabase (V2)

## Regra

Sempre criar componentes reutilizáveis.

Exemplos:

* Button
* Modal
* Badge
* NotificationBadge
* ShoppingItemCard

Evitar duplicação de código visual.

---

# 11. Roadmap

## v0.1.0 — MVP

* Dashboard
* Lista partilhada
* Categorias
* Quantidades
* Notification Badge
* LocalStorage

## v0.2.0

* Supabase
* Login familiar
* Utilizadores reais
* Realtime
* Sincronização entre dispositivos

## v0.3.0

* Despensa
* Produtos frequentes
* Autocomplete inteligente
* Gestão de categorias

## v0.4.0

* Fotografia do talão
* OCR
* Marcação automática de comprados

## v1.0.0

* Comparador de supermercados
* Promoções
* Cupões
* Histórico de preços

---

# 12. Regra de Ouro

Antes de desenvolver qualquer funcionalidade responder sempre:

**Qual o problema real que isto resolve para alguém que está dentro do supermercado?**

Se não existir uma resposta clara, a funcionalidade deve ser repensada.

---

# 13. Decisões Oficiais de UX

### Home minimalista

A Home deve mostrar apenas a informação essencial.

### Notificações silenciosas

Utilizar apenas o badge vermelho.

### Mobile acima de Desktop

O telemóvel é a plataforma principal. A versão desktop existe apenas como apoio.

### Dados com significado

Nenhum indicador deve existir sem uma regra de negócio clara. Cada número apresentado ao utilizador deve responder a uma pergunta útil.
