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
- **Armazenamento local:** AsyncStorage (sessão, contas, favoritos, vitrines,
  avaliações e preferências), encapsulado em `src/storage/storage.ts`. Expo
  SecureStore (dados sensíveis) fica previsto para a autenticação real

### Serviço externo (Etapa 06)

- **API:** [ViaCEP](https://viacep.com.br) — consulta de endereço por CEP
  (`GET https://viacep.com.br/ws/{cep}/json/`), pública e **sem credenciais**
- **Cliente HTTP:** `fetch` nativo, com timeout e cancelamento
  (`src/services/viacep.ts`)
- **Configuração:** URL base opcional em `EXPO_PUBLIC_VIACEP_URL`
  ([`.env.example`](.env.example))

### Backend e dados (Previsto)

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

### Implementadas (melhorias pós-Etapa 02)

- [x] Experiências separadas para **Cliente** (Início, Busca, Favoritos, Perfil)
      e **Prestador** (Painel, Avaliações, Perfil)
- [x] Cadastro do prestador em 2 passos: no primeiro login ele monta a
      **vitrine** (serviço, descrição, cidade/UF, preço, WhatsApp e fotos)
- [x] "Minha vitrine" (prévia de como o cliente vê o perfil) e edição da
      vitrine com **portfólio de fotos** (galeria do aparelho via
      `expo-image-picker`)
- [x] Busca com filtros de **nome/serviço, localização, tipo de serviço e nota
      mínima**, executada pelo botão "Buscar", com **ordenação** (melhor
      avaliados, mais avaliações, A–Z) e "Limpar filtros"
- [x] Avaliações com **data, serviço prestado e fotos**, tela de detalhe da
      avaliação e formulário **"Avaliar prestador"** (nota média recalculada)
- [x] Contato por **WhatsApp e ligação** (ilustrativos nesta versão)
- [x] Configurações: editar nome, notificações e "Sobre o app"
- [x] Persistência local (AsyncStorage): sessão, contas, favoritos, vitrines,
      avaliações e preferências
- [x] Ícones Ionicons (`@expo/vector-icons`) nas abas e na interface

### Implementadas (Etapa 03 — navegação, UX e acessibilidade)

- [x] Auditoria e correção de **contraste de cor** (WCAG AA, ≥4.5:1): botão
      "Chamar no WhatsApp" e destaques em âmbar (preço, variante `secondary`
      do `Button`) reprovavam e foram ajustados
- [x] **Alvos de toque ≥44×44px** em chips de filtro, segmento do formulário
      de vitrine e links de navegação secundária (antes menores)
- [x] **Cabeçalhos de tela** marcados com `accessibilityRole="header"` para
      navegação por leitor de tela (VoiceOver/TalkBack)
- [x] **Feedback visual não-bloqueante** (toast) para ações de salvar/avaliar
      que antes eram silenciosas, com anúncio automático para leitor de tela
- [x] Links de navegação secundária (Esqueci a senha, Criar conta, Sair e
      continuar depois etc.) marcados como botão para leitor de tela

Detalhes completos desta etapa (estrutura de navegação, telas e mecanismos de
acesso, feedback visual, decisões de UX e medidas de acessibilidade) em
[`docs/etapa-03.md`](docs/etapa-03.md).

### Implementadas (Etapa 04 — persistência local de dados)

- [x] Mecanismo documentado e justificado: **AsyncStorage**, acessado por um
      único módulo (`src/storage/storage.ts`) com chaves prefixadas `@asg/` e
      tolerante a falhas de leitura/escrita
- [x] Ciclo completo dos dados: **criar, armazenar, recuperar ao reabrir,
      atualizar, remover e apresentar** (contas, sessão, vitrines, avaliações,
      favoritos, fotos do portfólio e preferências)
- [x] Novo: **excluir avaliação própria** (nota média recalculada) e
      **excluir conta** (apaga conta, sessão, favoritos, preferências e a
      vitrine criada), ambos com confirmação
- [x] Procedimento de verificação (encerrar e reabrir o app) e resultado
      documentados

Estrutura dos dados, operações, telas e roteiro de teste em
[`docs/etapa-04.md`](docs/etapa-04.md).

### Implementadas (Etapa 06 — integração com serviço externo)

- [x] Integração com a **API ViaCEP** (HTTP/JSON): ao digitar o **CEP** no
      cadastro ou na edição da vitrine, o app consulta o serviço e **preenche
      cidade e UF** automaticamente (campos continuam editáveis)
- [x] Operação de **consulta** (`GET`) em camadas: `src/services/viacep.ts`
      (HTTP), `src/hooks/useCepLookup.ts` (estado) e
      `src/components/CepLookupField.tsx` (interface)
- [x] Tratamento dos quatro estados: **carregamento**, **sucesso**, **erro**
      (sem rede, tempo esgotado, falha do servidor, CEP incompleto — com
      "Tentar de novo") e **ausência de dados** (CEP inexistente)
- [x] Cancelamento de consultas antigas, timeout de 8 s e anúncio dos estados
      para leitores de tela
- [x] O CEP é opcional: com a API indisponível o cadastro continua por
      digitação manual

API utilizada, formato dos dados, fluxo, estados, configuração e roteiro de
teste em [`docs/etapa-06.md`](docs/etapa-06.md).

### Planejadas

- [ ] Cadastro/login real com Supabase Auth
- [ ] Persistência remota (Supabase) e upload das fotos (Supabase Storage)
- [ ] Localização do cliente (`expo-location`) para ordenar por proximidade

> A lista será atualizada conforme as etapas do projeto forem concluídas.

## 🏗️ Arquitetura

A aplicação tem a camada visual e estrutural (navegação, telas e componentes),
desde a Etapa 04 persistência local dos dados do usuário no aparelho
(AsyncStorage) e, desde a Etapa 06, comunicação por HTTP com um serviço externo
(ViaCEP), isolada em `src/services/` e `src/config/`. A arquitetura detalhada
(stack, decisões e próximos passos) é documentada e evoluída em
[`docs/arquitetura.md`](docs/arquitetura.md).

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

> Os dados criados no app (contas, avaliações, favoritos, vitrines) ficam salvos
> no aparelho e permanecem após fechar e reabrir o app; os prestadores de
> exemplo vêm de `src/data/`. A única comunicação de rede é a consulta de CEP
> (ViaCEP), que precisa de internet e **não exige chave nem configuração**. Para
> **testar a integração**, siga o roteiro de
> [`docs/etapa-06.md`](docs/etapa-06.md#8-como-testar-a-integração). Para **testar a
> persistência**, siga o roteiro de [`docs/etapa-04.md`](docs/etapa-04.md#7-procedimento-de-verificação-da-persistência-encerrar-e-reabrir).
> Instruções de navegação em [`docs/etapa-02.md`](docs/etapa-02.md) e
> [`docs/etapa-03.md`](docs/etapa-03.md).

### Configuração (opcional)

Nenhuma variável é obrigatória. Para trocar a URL base da API de CEP, copie
[`.env.example`](.env.example) para `.env` (ignorado pelo Git) e reinicie com
`npx expo start -c`. Variáveis `EXPO_PUBLIC_*` são embutidas no app: **nunca**
coloque chaves ou tokens nelas.

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

### Contas de teste

As contas ficam salvas localmente no aparelho (sem backend). Contas de exemplo,
definidas em [`src/data/mockUsers.json`](src/data/mockUsers.json):

| Perfil    | E-mail                | Senha       |
| --------- | --------------------- | ----------- |
| Cliente   | `teste@email.com`     | `Teste@123` |
| Prestador | `prestador@email.com` | `Teste@123` |

Também é possível tocar em **"Criar conta"**: após o cadastro, o app volta ao
login com o e-mail preenchido. Para contas de **Prestador**, o primeiro login
abre a tela "Monte sua vitrine".

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
├── .env.example             # variáveis opcionais (URL da API de CEP)
├── App.tsx                  # ponto de entrada (monta providers + navigator)
├── index.ts                 # registerRootComponent (Expo)
│
├── docs/
│   ├── proposta.md
│   ├── arquitetura.md
│   ├── evidencias.md
│   ├── etapa-02.md
│   ├── etapa-03.md
│   ├── etapa-04.md
│   └── etapa-06.md
│
├── src/
│   ├── navigation/           # Stack raiz, Bottom Tabs e Stacks por aba
│   ├── screens/               # uma tela por arquivo
│   ├── components/            # componentes reutilizáveis
│   ├── config/                 # URL base e timeout dos serviços externos
│   ├── data/                  # dados mockados desta etapa (JSON)
│   ├── contexts/               # Auth, Providers, Favorites, Settings e Toast
│   ├── hooks/                  # hooks de acesso aos dados e à API de CEP
│   ├── services/               # clientes HTTP dos serviços externos (ViaCEP)
│   ├── storage/                # acesso ao AsyncStorage (persistência local)
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
- [`docs/etapa-03.md`](docs/etapa-03.md) — navegação, UX e acessibilidade
  (Etapa 03)
- [`docs/etapa-04.md`](docs/etapa-04.md) — persistência local de dados
  (Etapa 04)
- [`docs/etapa-06.md`](docs/etapa-06.md) — integração com a API ViaCEP
  (Etapa 06)

## ⚠️ Limitações Conhecidas

- O backend Supabase está definido, mas ainda não foi integrado: os dados
  exibidos são mockados localmente em (`src/data/`). O único serviço externo
  integrado até agora é o ViaCEP (Etapa 06);
- Login/cadastro validam apenas localmente (contas e sessão salvas no
  AsyncStorage do aparelho, sem validação em servidor nem sincronização entre
  dispositivos); o AsyncStorage **não é criptografado**, então as senhas locais
  servem só à simulação desta etapa;
- A persistência foi verificada na versão web (reload da página); o roteiro de
  encerrar e reabrir o app no celular está em
  [`docs/etapa-04.md`](docs/etapa-04.md#7-procedimento-de-verificação-da-persistência-encerrar-e-reabrir)
  e deve ser repetido num aparelho;
- Excluir conta não apaga as avaliações que o usuário escreveu em outros
  prestadores nem remove contas/vitrines dos dados de exemplo;
- A consulta de CEP foi verificada com respostas da API **simuladas** (build web
  automatizado e testes da camada de serviço); a chamada ao ViaCEP real e a
  execução no celular devem ser conferidas pelo roteiro de
  [`docs/etapa-06.md`](docs/etapa-06.md#8-como-testar-a-integração). Sem internet,
  o CEP não é consultado (cidade e UF seguem preenchíveis à mão); o CEP não é
  armazenado;
- Contato por WhatsApp/ligação é ilustrativo (exibe o número, não abre o
  app de fato);
- Testes automatizados ainda não implementados;
- Acessibilidade com leitor de tela (VoiceOver/TalkBack) foi verificada via
  árvore de acessibilidade no preview web, não com o leitor de tela ligado
  num aparelho/simulador — ver limitação detalhada em
  [`docs/etapa-03.md`](docs/etapa-03.md#6-medidas-de-acessibilidade-implementadas);
- A arquitetura e as tecnologias poderão sofrer ajustes durante as etapas.
