# Etapa 02 — Implementação do Protótipo de Interface

Primeira versão visual e navegável do app, feita a partir da proposta da
[Etapa 01](proposta.md). Sem persistência de dados nem comunicação com
servidor — todo o conteúdo vem de arquivos JSON mockados em `src/data/`.

## 1. Telas implementadas

| #   | Tela                | Arquivo                                                                             | O que mostra                                                                    |
| --- | ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Splash              | [`src/screens/SplashScreen.tsx`](../src/screens/SplashScreen.tsx)                   | Abertura do app antes de decidir entre login e área logada.                     |
| 2   | Login               | [`src/screens/LoginScreen.tsx`](../src/screens/LoginScreen.tsx)                     | Entrar com e-mail e senha.                                                      |
| 3   | Cadastro            | [`src/screens/RegisterScreen.tsx`](../src/screens/RegisterScreen.tsx)               | Criar conta com nome, e-mail, senha e escolha de perfil (Cliente ou Prestador). |
| 4   | Início              | [`src/screens/HomeScreen.tsx`](../src/screens/HomeScreen.tsx)                       | Vitrine: grade de categorias + carrossel com os prestadores mais bem avaliados. |
| 5   | Busca               | [`src/screens/SearchScreen.tsx`](../src/screens/SearchScreen.tsx)                   | Busca por nome/cidade e filtro por categoria, com lista completa de resultados. |
| 6   | Perfil do Prestador | [`src/screens/ProviderProfileScreen.tsx`](../src/screens/ProviderProfileScreen.tsx) | Dados do profissional, avaliações e botão fixo "Chamar no WhatsApp".            |
| 7   | Favoritos           | [`src/screens/FavoritesScreen.tsx`](../src/screens/FavoritesScreen.tsx)             | Prestadores marcados como favoritos pelo cliente.                               |
| 8   | Perfil do Usuário   | [`src/screens/UserProfileScreen.tsx`](../src/screens/UserProfileScreen.tsx)         | Dados da conta logada, contadores e botão de logout.                            |

Total: **8 telas** (mínimo exigido pelo enunciado: 4).

**Navegação**: abas inferiores fixas (Início, Busca, Favoritos, Perfil). Cada
aba tem seu próprio stack de navegação, então abrir o Perfil do Prestador a
partir de qualquer uma delas sempre volta para a lista de origem ao apertar
"voltar".

## 2. Principais componentes utilizados

As telas combinam componentes nativos do React Native (`View`, `Text`,
`FlatList`, `ScrollView`, `Pressable`, `Switch`, `TextInput`) com os
componentes reutilizáveis do item 3. Os mais usados são:

- **`FlatList`** — listas de categorias, resultados de busca e o carrossel de
  destaques do Início.
- **`ScreenContainer`** — base de toda tela (área segura + espaçamento
  padrão).
- **`Switch`** — alternância de notificações no Perfil do Usuário.

## 3. Componentes reutilizáveis (`src/components/`)

| Componente                                                           | Onde é usado                                            | Função                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`ScreenContainer`](../src/components/ScreenContainer.tsx)           | Todas as telas                                          | Área segura, fundo e espaçamento padrão.                                        |
| [`Button`](../src/components/Button.tsx)                             | Login, Cadastro, Perfil do Prestador, Perfil do Usuário | Botão com variantes (`primary`/`secondary`/`outline`) e estado de carregamento. |
| [`TextField`](../src/components/TextField.tsx)                       | Login, Cadastro, Busca                                  | Campo de texto com rótulo e mensagem de erro.                                   |
| [`ProviderCard`](../src/components/ProviderCard.tsx)                 | Busca, Favoritos                                        | Cartão de prestador em lista: avatar, nome, categoria, nota, favoritar.         |
| [`FeaturedProviderCard`](../src/components/FeaturedProviderCard.tsx) | Início                                                  | Cartão de destaque do carrossel: avatar, nota, preço e descrição resumida.      |
| [`CategoryChip`](../src/components/CategoryChip.tsx)                 | Busca                                                   | Chip de categoria selecionável, usado como filtro.                              |
| [`CategoryTile`](../src/components/CategoryTile.tsx)                 | Início                                                  | Bloco de categoria em grade; ao tocar, abre a Busca já filtrada.                |
| [`Avatar`](../src/components/Avatar.tsx)                             | Cartões de prestador, Perfil do Prestador               | Círculo colorido com as iniciais do nome.                                       |
| [`RatingStars`](../src/components/RatingStars.tsx)                   | Cartões de prestador, Perfil do Prestador               | Nota em estrelas + quantidade de avaliações.                                    |
| [`EmptyState`](../src/components/EmptyState.tsx)                     | Início, Busca, Favoritos                                | Mensagem exibida quando uma lista está vazia.                                   |

Todos usam a paleta de cores e a escala de espaçamento centralizadas em
[`src/theme/index.ts`](../src/theme/index.ts), garantindo consistência visual
entre telas.

## 4. Elementos de entrada de dados

| Campo                                 | Tela              | Validação                                                           |
| ------------------------------------- | ----------------- | ------------------------------------------------------------------- |
| E-mail e senha                        | Login             | Formato (Zod) + comparação com usuário fictício em `mockUsers.json` |
| Nome, e-mail e senha                  | Cadastro          | Formato e tamanho mínimo (Zod)                                      |
| Seleção de perfil (Cliente/Prestador) | Login e Cadastro  | Obrigatória, via chips                                              |
| Busca por nome/cidade                 | Busca             | Texto livre, filtragem em tempo real                                |
| Seleção de categoria                  | Início e Busca    | Toque para filtrar (Busca) ou navegar já filtrado (Início)          |
| Alternância de notificações           | Perfil do Usuário | Switch on/off                                                       |

Login e Cadastro usam **React Hook Form** + **Zod** (via
`@hookform/resolvers`) para validação e exibição de erro por campo. No Login,
além do formato, o e-mail e a senha são comparados com o registro fictício em
[`src/data/mockUsers.json`](../src/data/mockUsers.json) (credenciais de teste
no [`README.md`](../README.md)).

## 5. Estratégias de adaptação de layout

- **Flexbox** em todas as telas, sem larguras/alturas fixas nos containers.
- **`SafeAreaView`** em todas as telas, respeitando notch, status bar e home
  indicator em diferentes aparelhos.
- **Listas roláveis** (`FlatList`/`ScrollView`) para conteúdo que pode
  ultrapassar a altura da tela (prestadores, avaliações, categorias).
- **Grade de categorias do Início** com `flexWrap`, quebrando linhas
  automaticamente conforme a largura disponível.
- **Carrossel de destaques do Início** com `FlatList` horizontal, que se
  adapta ao espaço sem quebrar o restante do layout.
- **`numberOfLines`** em textos longos (nome, categoria, descrição) para
  evitar que o conteúdo estoure a tela em aparelhos estreitos.

## 6. Instruções para execução da aplicação

Pré-requisitos: Node.js (LTS) e o app **Expo Go** no celular, ou um emulador
Android/iOS configurado.

```bash
npm install
npx expo start
```

Em seguida, escaneie o QR code com o **Expo Go**, ou pressione `a` (emulador
Android) / `i` (simulador iOS, macOS) no terminal.

Fluxo sugerido para testar:

1. Aguardar a tela de Splash;
2. Entrar com o usuário de teste `teste@email.com` / `Teste@123` (ver
   [`README.md`](../README.md)), ou tocar em "Criar conta" e preencher os
   dados;
3. Navegar pelas abas inferiores (Início, Busca, Favoritos, Perfil);
4. Tocar em um prestador para abrir o perfil, favoritar pelo ícone de coração
   e testar o botão fixo "Chamar no WhatsApp";
5. Na aba Perfil, tocar em "Sair da conta" para voltar ao login.

## 7. Principais decisões de interface

- **Início como vitrine, Busca como ferramenta**: para deixar clara a
  diferença de papel entre as duas telas, o Início usa uma grade de
  categorias e um carrossel de destaques com preço/descrição, enquanto a
  Busca usa uma lista densa com contador de resultados e filtro por
  categoria/texto.
- **Botão de contato fixo no Perfil do Prestador**: "Chamar no WhatsApp" fica
  fixo no rodapé da tela, sempre visível, independente da rolagem do
  conteúdo (descrição e avaliações).
- **Fluxo de autenticação declarativo**: a navegação raiz alterna entre
  Splash, Login/Cadastro e `Main` apenas observando o estado do
  `AuthContext`, sem chamadas manuais de reset/replace espalhadas pelas
  telas.
- **Stack de detalhe por aba**: Início, Busca e Favoritos têm cada um seu
  próprio Stack Navigator, para que "voltar" sempre retorne à lista de
  origem.
- **Favoritos em memória (Context API)**: persistência local (AsyncStorage)
  foi adiada para uma etapa futura; aqui o foco é a interação em tempo real.
- **Ícones em emoji**: evita adicionar uma biblioteca de ícones nesta etapa de
  protótipo visual.
- **Dados mockados em JSON** (`src/data/`), mantendo a decisão da Etapa 01 de
  não integrar backend ainda.
- **Avatares com iniciais**: em vez de fotos de rosto de terceiros.

## 8. Limitações desta etapa

- Sem persistência de dados (favoritos e login existem apenas em memória);
- Sem comunicação com servidor/backend;
- Login valida apenas contra o usuário fictício de `src/data/mockUsers.json`;
  o cadastro não confere credenciais reais, só o formato dos campos.
