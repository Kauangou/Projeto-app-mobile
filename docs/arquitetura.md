# Arquitetura

> Documento vivo: será atualizado a cada etapa conforme o projeto evolui.

## Etapa 01 — Planejamento

Nesta etapa o projeto ainda não possuía lógica de negócio implementada; o foco
foi planejamento, definição de telas/navegação e estrutura inicial do
repositório.

## Etapa 02 — Protótipo de interface implementado

Nesta etapa foi implementada a camada visual e estrutural da aplicação:
navegação completa, telas, componentes reutilizáveis e dados mockados. Ainda não
há persistência de dados nem comunicação com servidor — ver detalhamento
completo em [`docs/etapa-02.md`](etapa-02.md).

### Stack utilizada

- **Mobile:** React Native (Expo SDK 57) + TypeScript
- **Navegação:** React Navigation (`@react-navigation/native-stack` +
  `@react-navigation/bottom-tabs`) — stack raiz (Splash/Auth/Main), bottom tabs
  (Início, Busca, Favoritos, Perfil) e um stack próprio por aba para telas de
  detalhe
- **Estado:** Context API (`AuthContext` para sessão, `FavoritesContext` para
  favoritos) — ambos em memória nesta etapa, sem persistência
- **Formulários e validação:** React Hook Form + Zod (`@hookform/resolvers`),
  usados em Login/Cadastro
- **Dados desta etapa:** mock em JSON (`src/data/categories.json` e
  `src/data/mockProviders.json`)
- **Backend:** Supabase (PostgreSQL, Auth e Storage), com RLS — planejado, ainda
  não integrado
- **Persistência local:** AsyncStorage + Expo SecureStore — planejado, ainda não
  implementado
- **Recursos nativos:** `Linking` (contato via WhatsApp) já em uso; Expo Image
  Picker e Expo Location planejados
- **Testes:** Jest + React Native Testing Library — planejado, ainda não
  implementado

### Estrutura de pastas

O ponto de entrada (`App.tsx`) permanece na raiz do projeto, seguindo a
convenção padrão do `create-expo-app` (decisão registrada em
[`docs/etapa-02.md`](etapa-02.md), item 7), em vez de `src/App.tsx` como
sugerido na Etapa 01.

```
App.tsx                      # ponto de entrada: providers + AppNavigator
index.ts                     # registerRootComponent (Expo)
src/
├── navigation/               # AppNavigator (raiz), MainTabNavigator e um Stack por aba
├── screens/                  # uma tela por arquivo
├── components/               # componentes reutilizáveis (Button, TextField, ProviderCard, ...)
├── data/                     # dados mockados desta etapa (JSON)
├── contexts/                 # AuthContext e FavoritesContext
├── hooks/                    # hooks de acesso aos dados mockados
├── theme/                    # cores, espaçamentos e tipografia centralizados
└── types/                    # tipos e contratos da aplicação
```

## Melhorias pós-Etapa 02 — perfis separados, vitrine e persistência local

### Navegação por perfil

A stack raiz (`src/navigation/AppNavigator.tsx`) escolhe a área exibida a partir
do estado da sessão, sem `reset` manual nas telas:

| Estado da sessão              | Área exibida                                      |
| ----------------------------- | ------------------------------------------------- |
| Sem usuário                   | Login / Cadastro                                  |
| Prestador sem vitrine         | `ProviderSetup` (passo 2 do cadastro)             |
| Prestador com vitrine         | `ProviderTabs`: Painel, Avaliações, Perfil        |
| Cliente                       | `ClientTabs`: Início, Busca, Favoritos, Perfil    |

As stacks internas (`src/navigation/stacks.tsx`) usam um único navigator
tipado; as telas de detalhe (`ProviderProfile`, `ReviewDetail`, `ReviewForm`)
são registradas uma vez e reaproveitadas em todas as abas.

### Estado e persistência

- `src/storage/storage.ts`: leitura/escrita JSON no **AsyncStorage** (prefixo
  `@asg/`).
- `AuthContext`: contas cadastradas + sessão; `register`, `signIn`, `signOut`,
  `updateUser`.
- `ProvidersContext`: prestadores do mock + vitrines criadas/alteradas e
  avaliações novas (salvas como sobrescritas por id). Nota média e total de
  avaliações são **calculados** a partir das avaliações (`src/utils/rating.ts`).
- `FavoritesContext` e `SettingsContext`: favoritos e preferência de
  notificações, salvos por usuário.
- Lógica de busca isolada em funções puras (`src/utils/search.ts`), com
  comparação sem acentos (`src/utils/text.ts`).

### Novas dependências

- `@expo/vector-icons` (Ionicons), `@react-native-async-storage/async-storage`,
  `expo-image-picker` e `expo-constants`.

### Limitações

- O contato por WhatsApp/ligação é ilustrativo (exibe o número em um aviso).
- As fotos escolhidas são guardadas como URI local do aparelho; o envio para o
  Supabase Storage fica para a etapa de backend.

### Próximos passos (etapas futuras)

- Configurar projeto, tabelas e políticas RLS no Supabase;
- Implementar cadastro/login real e persistência de sessão;
- Migrar a persistência local (AsyncStorage) para o backend;
- Integrar persistência remota e upload de imagens (Supabase Storage);
- Introduzir TanStack Query para cache de dados remotos;
- Implementar testes automatizados (`tests/`).
