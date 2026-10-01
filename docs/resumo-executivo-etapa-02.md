# 📋 Resumo Executivo: Etapa 02 + Otimizações Posteriores

| | |
|---|---|
| **Etapa 02: Protótipo de interface** | Tag `etapa-02` (commit `e8ae030`, 10/09/2026) |
| **Otimizações gerais** | Commit `b47f05a` (23/09/2026), "Otimizações Gerais" |

---

## 1. Etapa 02: o que foi feito

**Objetivo do enunciado:** transformar a proposta da Etapa 01 numa primeira versão visual e navegável. Persistência e servidor não eram exigidos.

| Exigência do enunciado | Entrega |
|---|---|
| Tela inicial + 3 telas adicionais (mínimo) | **8 telas:** Splash, Login, Cadastro, Início, Busca, Perfil do Prestador, Favoritos e Perfil do Usuário. |
| Componentes compatíveis com o objetivo | `ProviderCard`, `FeaturedProviderCard`, `CategoryTile`, `CategoryChip`, `RatingStars`, `Avatar`, carrossel de destaques e botão fixo "Chamar no WhatsApp". |
| Organização visual consistente | Tema centralizado em `src/theme` (cores, espaçamento, tipografia) e `ScreenContainer` como base de todas as telas. |
| Entrada de dados | Login e Cadastro com **React Hook Form + Zod**, escolha de perfil (Cliente ou Prestador), busca por nome ou cidade, filtro por categoria e switch de notificações. |
| Botões, listas, campos e menus | Abas inferiores, `FlatList`, chips, campos com rótulo e erro, e botões com variantes e estado de carregamento. |
| Layout adaptável | Flexbox sem tamanhos fixos, `SafeAreaView`, listas roláveis, grade com `flexWrap`, carrossel horizontal e `numberOfLines` nos textos longos. |
| Separação componentes × telas | 10 componentes reutilizáveis em `src/components/`, mais `contexts/`, `hooks/`, `data/` e `types/`. |

**Navegação**
- O Stack raiz alterna Splash, Auth e Main apenas pelo estado da sessão (`AuthContext`), sem `reset` manual nas telas.
- Há 4 abas (Início, Busca, Favoritos, Perfil), cada uma com seu próprio Stack. O botão "voltar" retorna à lista de origem.

**Dados**
- Continuaram simulados em JSON.
- Favoritos e login existiam só em memória.
- O login validava apenas o usuário fictício de `mockUsers.json`.

**Entregáveis exigidos**
- ✅ README atualizado
- ✅ `docs/etapa-02.md`, com os 7 tópicos pedidos
- ✅ Tag `etapa-02`
- ✅ Prints em `docs/screenshots/` (Splash, Login, Home, Busca, Favoritos e Perfil)

---

## 2. Otimizações pós-Etapa 02 (`b47f05a`)

O commit alterou 71 arquivos (+4.177 / −799 linhas). Ele evoluiu o protótipo para algo próximo de um app funcional, sem backend.

### Funcionalidades novas

- **Dois perfis separados**
  - O **Cliente** tem Início, Busca, Favoritos e Perfil.
  - O **Prestador** tem Painel, Avaliações e Perfil.
- **Cadastro do prestador em 2 passos:** no primeiro acesso ele monta a vitrine (`ProviderSetup`). Depois pode ver como o cliente enxerga o perfil e editar (`EditProviderProfile`).
- **Avaliações completas:** formulário com nota, data, serviço prestado e fotos (`ReviewForm`), tela de detalhe e galeria com visualizador. A nota média passou a ser calculada a partir das avaliações.
- **Busca avançada:** filtros por nome ou serviço, localização, categoria e nota mínima, com ordenação e comparação sem acentos.
- **Conta e configurações:** editar nome (`EditAccount`), notificações e "Sobre o app" (`About`).
- **Contato por WhatsApp e ligação**, ainda de forma ilustrativa.

### Melhorias técnicas

- **Persistência local** com AsyncStorage (`src/storage/`). Guarda sessão, contas, favoritos, vitrines e preferências por usuário.
- **Estado global ampliado:** novos `ProvidersContext` e `SettingsContext`, além de `AuthContext` e `FavoritesContext` reformulados.
- **Navegação refatorada:** 5 arquivos de stack e tab foram consolidados em `TabNavigators.tsx` e `stacks.tsx`. Há um único navigator tipado, e as telas de detalhe são registradas uma vez e reaproveitadas.
- **Pasta `utils/` nova:** `search`, `rating`, `date`, `text`, `images`, `imagePicker` e `feedback`, com a lógica de busca isolada em funções puras.
- **Interface:** ícones Ionicons no lugar dos emojis, 12 novos componentes (de 10 para 22) e reforço em `Avatar`, `Button`, `TextField` e `ScreenContainer`.
- **Novas dependências:** `@expo/vector-icons`, `async-storage`, `expo-image-picker` e `expo-constants`.

---

## 3. Balanço

| Indicador | Etapa 02 (tag) | Após otimizações |
|---|---|---|
| Telas | 8 | **16** |
| Componentes reutilizáveis | 10 | **22** |
| Contextos | 2 (em memória) | **4** (persistidos) |
| Perfis de usuário | 1 fluxo único | **2** (Cliente e Prestador) |
| Persistência | Nenhuma | **AsyncStorage** |
| Ícones | Emojis | **Ionicons** |

**Permanece pendente:** Supabase (Auth, banco e Storage), upload de fotos, localização, TanStack Query e testes automatizados. Isso está registrado como limitação conhecida no README.

---

## ⚠️ Pontos de atenção

1. **As otimizações não estão na tag `etapa-02`.** Ela aponta para `e8ae030`, anterior ao `b47f05a`. As melhorias entraram na tag `etapa-03`. Quem avaliar a Etapa 02 pela tag verá o protótipo simples.
2. **`docs/etapa-02.md` na `main`** ainda cita "ícones em emoji" e "favoritos em memória". Isso reflete a versão da tag, não o código atual.
3. **A persistência local foi um adiantamento.** O enunciado a dispensava nesta etapa, então vale explicar que foi um avanço de escopo e não um desvio.
