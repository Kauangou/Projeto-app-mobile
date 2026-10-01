# 📂 Estrutura do Projeto: App Serviços Gerais

Aplicativo mobile (React Native + Expo + TypeScript) que conecta clientes a prestadores de serviços gerais. Este documento explica, de forma resumida, onde fica cada coisa no repositório.

## 🌳 Visão geral

```text
app-serviços-gerais/
├── App.tsx                  # Componente raiz: monta os Providers e o Navigator
├── index.ts                 # Ponto de entrada: registra o App no Expo
├── app.json                 # Configuração do Expo (nome, ícones, permissões)
├── package.json             # Dependências e scripts (start, android, ios, web)
├── tsconfig.json            # Configuração do TypeScript
├── README.md                # Apresentação do projeto e como executar
│
├── assets/                  # Ícones e imagem de splash do app
├── docs/                    # Documentação por etapa
└── src/                     # Todo o código do aplicativo
    ├── components/
    ├── contexts/
    ├── data/
    ├── hooks/
    ├── navigation/
    ├── screens/
    ├── storage/
    ├── theme/
    ├── types/
    └── utils/
```

## 🧱 Raiz do projeto

| Arquivo / pasta | Função |
|---|---|
| `index.ts` | Primeiro arquivo executado. Registra o `App` no Expo. |
| `App.tsx` | Envolve o app com os *providers* (Toast, Auth, Providers, Favoritos, Configurações) e renderiza o `AppNavigator`. |
| `app.json` | Nome, versão, ícones, orientação e permissão de acesso às fotos. |
| `package.json` | Lista de bibliotecas e scripts (`npm start`, `npm run android`...). |
| `tsconfig.json` | Regras do TypeScript. |
| `assets/` | Ícone do app, ícones adaptativos do Android, favicon e imagem de splash. |

## 📚 `docs/`: documentação

| Arquivo | Conteúdo |
|---|---|
| `proposta.md` | Etapa 01: problema, público, telas, fluxo e tecnologias. |
| `arquitetura.md` | Decisões técnicas e evolução da arquitetura. |
| `etapa-02.md` | Protótipo de interface: telas e componentes. |
| `etapa-03.md` | Navegação, UX e acessibilidade. |
| `evidencias.md` | Evidências de funcionamento de cada etapa. |
| `screenshots/` | Prints das telas (Splash, Login, Home, Busca, Favoritos, Perfil). |

## 💻 `src/`: código do app

### `screens/` (telas)
Uma tela por arquivo. Cada uma é uma página que o usuário vê.

| Grupo | Telas |
|---|---|
| **Entrada** | `SplashScreen`, `LoginScreen`, `RegisterScreen` |
| **Cliente** | `HomeScreen`, `SearchScreen`, `FavoritesScreen`, `ProviderProfileScreen`, `ReviewFormScreen` |
| **Prestador** | `ProviderSetupScreen`, `ProviderDashboardScreen`, `EditProviderProfileScreen`, `ReceivedReviewsScreen`, `ReviewDetailScreen` |
| **Conta** | `UserProfileScreen`, `EditAccountScreen`, `AboutScreen` |

### `navigation/` (navegação)
Define como o usuário se move entre as telas.

| Arquivo | Função |
|---|---|
| `AppNavigator.tsx` | Navegador raiz. Escolhe a área exibida conforme a sessão (deslogado, cliente ou prestador). |
| `TabNavigators.tsx` | Abas inferiores: uma versão para o cliente e outra para o prestador. |
| `stacks.tsx` | Pilhas de navegação de cada aba (permitem abrir telas de detalhe e voltar). |
| `types.ts` | Tipos TypeScript das rotas e dos parâmetros. |

### `components/` (peças reutilizáveis de interface)
Componentes pequenos usados em várias telas, agrupados por finalidade:

- **Base e formulário:** `Button`, `TextField`, `SegmentedControl`, `ChipGroup`, `ScreenContainer`, `SectionTitle`
- **Prestadores:** `ProviderCard`, `FeaturedProviderCard`, `ProviderProfileForm`, `Avatar`, `FavoriteButton`
- **Categorias:** `CategoryChip`, `CategoryTile`
- **Avaliações:** `RatingStars`, `StarRatingInput`, `ReviewCard`
- **Fotos:** `PhotoGallery`, `PhotoViewerModal`
- **Feedback e apoio:** `Toast`, `EmptyState`, `StatCard`, `SettingRow`, `Icon`

### `contexts/` (estado global)
Guardam informações compartilhadas entre telas, cada uma com seu *Provider* e seu hook de uso.

| Contexto | O que controla |
|---|---|
| `AuthContext` | Cadastro, login, logout e sessão do usuário. |
| `ProvidersContext` | Lista de prestadores, perfis e avaliações. |
| `FavoritesContext` | Favoritos do cliente. |
| `SettingsContext` | Preferências do usuário. |
| `ToastContext` | Mensagens rápidas de feedback. |

### `hooks/` (lógica reutilizável)
- `useProviders`: busca prestadores, o perfil do próprio prestador e o contador de avaliações.
- `useCategories`: busca categorias e o subtítulo do prestador.

### `data/` (dados simulados)
Arquivos JSON que fazem o papel de "banco de dados" nesta fase:
`categories.json`, `mockProviders.json`, `mockUsers.json`.

### `storage/` (armazenamento local)
`storage.ts` guarda e lê dados no celular via **AsyncStorage**: contas, sessão, prestadores, favoritos e configurações. Assim os dados continuam no app mesmo depois de fechá-lo.

### `theme/` (identidade visual)
`index.ts` reúne cores, espaçamentos, bordas e tipografia. Alterar aqui muda o visual do app todo.

### `types/` (tipos)
`index.ts` define as estruturas de dados do app (Usuário, Prestador, Avaliação, Categoria etc.).

### `utils/` (funções auxiliares)

| Arquivo | Função |
|---|---|
| `search.ts` | Filtros e ordenação da busca. |
| `rating.ts` | Cálculo da média de avaliações. |
| `date.ts` | Formatação e máscara de datas. |
| `text.ts` | Normalização de texto e formatação de telefone. |
| `images.ts` | Resolve a origem das imagens (local ou da galeria). |
| `imagePicker.ts` | Seleção de imagens da galeria. |
| `feedback.ts` | Exibição de mensagens ao usuário. |

## 🔄 Como as peças se conectam

```text
index.ts → App.tsx → Providers (contexts) → AppNavigator
                                                │
                              Tabs → Stacks → Screens → Components
                                                │
                                  hooks / utils / theme / types
                                                │
                                      storage + data (JSON)
```

1. O app inicia em `index.ts` e carrega o `App.tsx`.
2. O `App.tsx` disponibiliza o estado global (contexts) para todas as telas.
3. O `AppNavigator` decide qual área mostrar e as telas montam a interface com os componentes.
4. Os dados vêm dos JSONs em `data/` e são persistidos no aparelho por `storage/`.

## 🚫 Ignorado pelo Git (`.gitignore`)

Não são versionados: `node_modules/` (dependências instaladas), `dist/` (build web gerado), arquivos `.env`, caches e arquivos de sistema/IDE.

## 📝 Observações

- Em relação à estrutura planejada na Etapa 01, a pasta `services/` foi substituída por `storage/`. Foram adicionadas `theme/` e `utils/`.
- A pasta `tests/` ainda não foi criada, pois não há testes automatizados nesta fase.
- O Supabase (backend previsto) ainda não está integrado. Por enquanto os dados são simulados e salvos localmente.
