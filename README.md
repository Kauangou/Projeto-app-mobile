# 📱 Projeto: App de Serviços Gerais

> Aplicativo mobile que conecta clientes a prestadores de serviços gerais
> (pintores, pedreiros, encanadores, eletricistas, jardineiros, montadores,
> técnicos de ar-condicionado, diaristas, costureiras, entre outros),
> funcionando como uma vitrine virtual para profissionais autônomos de áreas com
> pouca visibilidade digital.

## 📌 Sobre o Projeto

Este projeto consiste no desenvolvimento incremental de uma aplicação mobile
para a disciplina de **Tecnologia de Construção de Software II**.

Profissionais autônomos de serviços gerais costumam ter pouca visibilidade
digital e dependem principalmente de indicação boca a boca, enquanto clientes
têm dificuldade em encontrar profissionais confiáveis de forma centralizada. O
**App de Serviços Gerais** busca aproximar os dois lados: divulgação para quem
presta o serviço e busca/avaliação para quem contrata.

A aplicação será desenvolvida ao longo do semestre, incorporando
progressivamente novas funcionalidades, melhorias de arquitetura, interface,
persistência de dados, integração com APIs, testes, segurança e outros recursos
pertinentes ao escopo definido. Todas as etapas serão realizadas sobre o mesmo
projeto, permitindo sua evolução contínua durante a disciplina.

📄 Proposta completa (público-alvo, telas, fluxo de navegação e decisões
técnicas): [`docs/proposta.md`](docs/proposta.md)

## 🛠️ Tecnologias

### Aplicação Mobile

- **Framework:** React Native (Expo)
- **Linguagem:** TypeScript
- **Navegação:** React Navigation (Bottom Tabs + Stack Navigator)
- **Formulários e validação:** React Hook Form + Zod
- **Estado:** Context API (sessão) + TanStack Query (dados remotos e cache)
- **Armazenamento local:** AsyncStorage (preferências e cache) + Expo
  SecureStore (dados sensíveis de pequeno porte)

### Backend e dados

- **Plataforma:** Supabase
- **Banco de dados:** PostgreSQL
- **Autenticação:** Supabase Auth (e-mail e senha)
- **Armazenamento de imagens:** Supabase Storage
- **Segurança:** Row Level Security (RLS) para controle de acesso aos dados
- **Dados desta etapa:** simulados localmente em JSON (`src/data/`)

### Ferramentas

- Git / GitHub
- Expo Go (execução em dispositivo físico durante o desenvolvimento)
- Jest + React Native Testing Library
- ESLint + Prettier
- EAS Build (preparação de builds nas etapas finais)

As tecnologias poderão ser alteradas ou complementadas ao longo do
desenvolvimento, desde que as decisões sejam justificadas e documentadas.

## ✨ Funcionalidades

### Implementadas (Etapa 02 — protótipo de interface)

- [x] Estrutura do projeto Expo + TypeScript configurada
- [x] Navegação completa: Splash → Login/Cadastro → Tabs (Início, Busca,
      Favoritos, Perfil), com Stack Navigator próprio por aba para telas de
      detalhe
- [x] Tela de Login/Cadastro com formulário validado (React Hook Form + Zod) e
      escolha de perfil (Cliente / Prestador)
- [x] Tela Home com categorias em destaque e prestadores sugeridos
- [x] Tela de Busca com filtro por categoria e por nome/cidade
- [x] Tela de Perfil do Prestador (avatar com iniciais, descrição, avaliações
      e botão de contato via WhatsApp)
- [x] Tela de Favoritos (favoritar/desfavoritar prestadores em tempo de sessão,
      via Context API)
- [x] Tela de Perfil do Usuário (dados da conta e logout)
- [x] Componentes reutilizáveis (`Button`, `TextField`, `ProviderCard`,
      `CategoryChip`, `RatingStars`, `EmptyState`, `ScreenContainer`)
- [x] Layout responsivo (Flexbox, listas roláveis, `SafeAreaView`)
- [x] Dados mockados localmente (`src/data/*.json`)

Detalhes completos desta etapa (telas, componentes, entradas de dados, adaptação
de layout e decisões de interface) em [`docs/etapa-02.md`](docs/etapa-02.md).

### Planejadas

- [ ] Cadastro/login real com Supabase Auth
- [ ] Persistência local (AsyncStorage / SecureStore) e remota (Supabase)
- [ ] Comunicação com API (Supabase)
- [ ] Recursos nativos do dispositivo (galeria/Image Picker, localização)

> A lista será atualizada conforme as etapas do projeto forem concluídas.

## 🏗️ Arquitetura

Nesta etapa foi implementada a camada visual e estrutural da aplicação
(navegação, telas e componentes), ainda sem persistência de dados ou comunicação
com servidor. A arquitetura detalhada (stack, decisões e próximos passos) é
documentada e evoluída em [`docs/arquitetura.md`](docs/arquitetura.md).

## 🚀 Execução

### Pré-requisitos

- Node.js (versão LTS)
- Aplicativo **Expo Go** instalado no celular (Android/iOS) — ou um emulador
  Android/iOS configurado

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre no diretório
cd app-servicos-gerais

# Instale as dependências
npm install
```

### Execução

```bash
npx expo start
```

Em seguida, escaneie o QR code exibido no terminal com o app Expo Go
(Android/iOS).

> Nesta etapa (Etapa 02) a aplicação possui a interface navegável completa
> (protótipo visual), mas ainda sem persistência de dados nem comunicação com
> servidor (os dados exibidos são mockados localmente). Instruções detalhadas de
> execução e navegação em [`docs/etapa-02.md`](docs/etapa-02.md).

### Executando em redes institucionais (ex.: Wi-Fi da PUC-GO)

Em redes de faculdade/corporativas, `npx expo start` no modo padrão (LAN) pode
falhar com **timeout no Expo Go**, mesmo com o celular e o computador na mesma
rede Wi-Fi. Isso costuma acontecer porque esse tipo de rede:

- isola os dispositivos entre si (client/AP isolation), impedindo a conexão
  direta celular ↔ computador; ou
- é IPv6-only com NAT64/CLAT, fazendo o Metro anunciar um endereço que não é
  alcançável pelo celular (ex.: um IP fora do padrão de LAN, como `192.0.0.x`).

**Solução:** rodar em modo túnel, que trafega pela internet em vez de depender
da rede local:

```bash
npm run tunnel
```

O modo túnel usa o pacote `@expo/ngrok` (já incluso como devDependency do
projeto). Escaneie o QR code normalmente; se ele não aparecer no terminal,
copie a URL `exp://...` exibida e cole em **"Enter URL manually"** na tela
inicial do Expo Go.

### Login de teste

A tela de login valida contra um usuário fictício fixo (sem backend), definido
em [`src/data/mockUsers.json`](src/data/mockUsers.json):

- **E-mail:** `teste@email.com`
- **Senha:** `Teste@123`

Alternativamente, é possível tocar em **"Criar conta"** e preencher
nome/e-mail/senha — o cadastro aceita qualquer combinação válida quanto ao
formato dos campos, sem checagem contra credenciais existentes.

### Acesso pela web (EAS Hosting)

Além do celular via Expo Go, o projeto também pode ser publicado como site
estático e acessado por um link (ex.:
`https://app-servicos-gerais.expo.app`), usando o **EAS Hosting**:

```bash
# 1. Instalar as dependências de web (uma vez)
npx expo install react-dom react-native-web @expo/metro-runtime

# 2. Instalar a EAS CLI e logar na conta Expo
npm install -g eas-cli
eas login

# 3. Vincular o projeto à conta (gera o projectId no app.json)
eas init

# 4. Gerar o build estático da web
npx expo export -p web

# 5. Publicar (cria uma URL de preview)
eas deploy

# 6. Publicar na URL de produção (a fixa, baseada no slug do app.json)
eas deploy --prod
```

Para atualizar o site após novas alterações, repita os passos 4 e 6. O login
(passo 2) e a publicação (passos 5/6) exigem uma conta Expo e não são
executados automaticamente — precisam ser rodados manualmente pelo
desenvolvedor.

## 📂 Estrutura do Projeto

```text
app-servicos-gerais/
│
├── README.md
├── App.tsx                  # ponto de entrada (monta providers + navigator)
├── index.ts                 # registerRootComponent (Expo)
│
├── docs/
│   ├── proposta.md
│   ├── arquitetura.md
│   ├── evidencias.md
│   └── etapa-02.md
│
├── src/
│   ├── navigation/           # Stack raiz, Bottom Tabs e Stacks por aba
│   ├── screens/               # uma tela por arquivo
│   ├── components/            # componentes reutilizáveis
│   ├── data/                  # dados mockados desta etapa (JSON)
│   ├── contexts/               # AuthContext e FavoritesContext
│   ├── hooks/                  # hooks de acesso aos dados mockados
│   ├── theme/                  # cores, espaçamentos e tipografia
│   └── types/                  # tipos e contratos da aplicação
│
├── assets/
├── package.json
├── tsconfig.json
└── app.json
```

A estrutura segue a organização recomendada para o repositório do projeto na
disciplina, com o ponto de entrada (`App.tsx`) na raiz por ser essa a convenção
gerada pelo Expo.

## 📈 Desenvolvimento Incremental

O projeto será desenvolvido de forma incremental. Cada etapa deverá evoluir a
aplicação desenvolvida anteriormente, preservando as funcionalidades existentes
sempre que possível.

As versões das entregas serão identificadas por tags Git seguindo a convenção:

```text
etapa-01
etapa-02
etapa-03
...
etapa-10
final
```

## 📝 Documentação

As principais decisões técnicas, alterações de escopo e informações relevantes
para compreensão e manutenção do projeto são documentadas ao longo do
desenvolvimento, no diretório `docs/`:

- [`docs/proposta.md`](docs/proposta.md) — proposta e planejamento (Etapa 01)
- [`docs/arquitetura.md`](docs/arquitetura.md) — decisões técnicas e arquitetura
- [`docs/evidencias.md`](docs/evidencias.md) — evidências de funcionamento por
  etapa
- [`docs/etapa-02.md`](docs/etapa-02.md) — detalhamento do protótipo de
  interface (Etapa 02)

## ⚠️ Limitações Conhecidas

- O backend Supabase está definido, mas ainda não foi integrado: os dados
  exibidos são mockados localmente em (`src/data/`);
- Login/cadastro ainda não são reais (sem validação de credenciais no servidor
  nem persistência, a sessão existe apenas em memória, via Context API, e é
  perdida ao fechar o app);
- Favoritos existem apenas durante a sessão (não são persistidos);
- Testes automatizados ainda não implementados;
- A arquitetura e as tecnologias poderão sofrer ajustes durante as etapas.
