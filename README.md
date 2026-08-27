# 📱 Projeto: App de Serviços Gerais

> Aplicativo mobile que conecta clientes a prestadores de serviços gerais
> (pintores, pedreiros, encanadores, eletricistas, jardineiros, montadores,
> técnicos de ar-condicionado, diaristas, costureiras, entre outros),
> funcionando como uma vitrine virtual para profissionais autônomos de áreas
> com pouca visibilidade digital.

## 📌 Sobre o Projeto

Este projeto consiste no desenvolvimento incremental de uma aplicação mobile
para a disciplina de **Tecnologia de Construção de Software II**.

Profissionais autônomos de serviços gerais costumam ter pouca visibilidade
digital e dependem principalmente de indicação boca a boca, enquanto clientes
têm dificuldade em encontrar profissionais confiáveis de forma centralizada.
O **App de Serviços Gerais** busca aproximar os dois lados: divulgação para
quem presta o serviço e busca/avaliação para quem contrata.

A aplicação será desenvolvida ao longo do semestre, incorporando
progressivamente novas funcionalidades, melhorias de arquitetura, interface,
persistência de dados, integração com APIs, testes, segurança e outros
recursos pertinentes ao escopo definido. Todas as etapas serão realizadas
sobre o mesmo projeto, permitindo sua evolução contínua durante a disciplina.

📄 Proposta completa (público-alvo, telas, fluxo de navegação e decisões
técnicas): [`docs/proposta.md`](docs/proposta.md)

## 🛠️ Tecnologias

### Aplicação Mobile

* **Framework:** React Native (Expo)
* **Linguagem:** TypeScript
* **Navegação:** React Navigation (Bottom Tabs + Stack Navigator)
* **Formulários e validação:** React Hook Form + Zod
* **Estado:** Context API (sessão) + TanStack Query (dados remotos e cache)
* **Armazenamento local:** AsyncStorage (preferências e cache) + Expo SecureStore
  (dados sensíveis de pequeno porte)

### Backend e dados

* **Plataforma:** Supabase
* **Banco de dados:** PostgreSQL
* **Autenticação:** Supabase Auth (e-mail e senha)
* **Armazenamento de imagens:** Supabase Storage (portfólios)
* **Segurança:** Row Level Security (RLS) para controle de acesso aos dados
* **Dados desta etapa:** simulados localmente em JSON (`src/data/`)

### Ferramentas

* Git / GitHub
* Expo Go (execução em dispositivo físico durante o desenvolvimento)
* Jest + React Native Testing Library
* ESLint + Prettier
* EAS Build (preparação de builds nas etapas finais)

As tecnologias poderão ser alteradas ou complementadas ao longo do
desenvolvimento, desde que as decisões sejam justificadas e documentadas.

## ✨ Funcionalidades

### Implementadas

* [x] Estrutura inicial da aplicação
* [x] Navegação entre telas (Login, Home, Busca, Perfil do Prestador, Perfil do Usuário)
* [x] Interface inicial (esqueleto de telas, sem estilização final)

### Planejadas

* [ ] Cadastro/login real (Cliente / Prestador)
* [ ] Busca e filtro de prestadores por categoria e localização
* [ ] Avaliações e portfólio no perfil do prestador
* [ ] Favoritos persistidos (AsyncStorage)
* [ ] Contato direto com o prestador (WhatsApp)
* [ ] Persistência local (AsyncStorage / SecureStore)
* [ ] Comunicação com API (Supabase e/ou mapas)
* [ ] Gerenciamento de estado e cache de dados remotos
* [ ] Recursos nativos do dispositivo (galeria, localização e links externos)
* [ ] Autenticação e segurança
* [ ] Testes automatizados
* [ ] Melhorias de desempenho
* [ ] Preparação para publicação

> A lista será atualizada conforme as etapas do projeto forem concluídas.

## 🏗️ Arquitetura

Nesta etapa, o projeto ainda não possui lógica de negócio implementada — o
foco foi planejamento, definição de telas/navegação e estrutura inicial do
repositório. A arquitetura detalhada (stack, decisões e próximos passos) é
documentada e evoluída em [`docs/arquitetura.md`](docs/arquitetura.md).

## 🚀 Execução

### Pré-requisitos

* Node.js (versão LTS)
* Aplicativo **Expo Go** instalado no celular (Android/iOS) — ou um emulador
  Android/iOS configurado

### Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre no diretório
cd AppServicosGerais

# Instale as dependências
npm install
```

### Execução

```bash
npx expo start
```

Em seguida, escaneie o QR code exibido no terminal com o app Expo Go
(Android/iOS) ou pressione `a` (Android) / `i` (iOS) no terminal do Expo para
abrir em um emulador.

> Nesta etapa (Etapa 01) o projeto contém a estrutura inicial e o esqueleto de
> telas/navegação. A lógica funcional será implementada progressivamente nas
> próximas etapas.

## 📂 Sugestão de Estrutura do Projeto

```text
AppServicosGerais/
│
├── README.md
│
├── docs/
│   ├── proposta.md
│   ├── arquitetura.md
│   └── evidencias.md
│
├── src/
│   ├── App.tsx
│   ├── navigation/
│   ├── screens/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── contexts/
│   ├── hooks/
│   └── types/
│
├── tests/
├── assets/
├── package.json
└── app.json
```

A estrutura segue a organização recomendada para o repositório do projeto na
disciplina.

## 📈 Desenvolvimento Incremental

O projeto será desenvolvido de forma incremental. Cada etapa deverá evoluir a
aplicação desenvolvida anteriormente, preservando as funcionalidades
existentes sempre que possível.

As versões das entregas serão identificadas por tags Git seguindo a
convenção:

```text
etapa-01
etapa-02
etapa-03
...
etapa-10
final
```

## 📝 Documentação

As principais decisões técnicas, alterações de escopo e informações
relevantes para compreensão e manutenção do projeto são documentadas ao longo
do desenvolvimento, no diretório `docs/`:

* [`docs/proposta.md`](docs/proposta.md) — proposta e planejamento (Etapa 01)
* [`docs/arquitetura.md`](docs/arquitetura.md) — decisões técnicas e arquitetura
* [`docs/evidencias.md`](docs/evidencias.md) — evidências de funcionamento por etapa

## ⚠️ Limitações Conhecidas

* O backend Supabase está definido, mas ainda não foi integrado: os dados
  exibidos são mockados localmente;
* Autenticação ainda não é real (sem validação/segurança);
* Telas atuais são esqueletos de navegação, sem estilização final;
* Testes automatizados ainda não implementados;
* A arquitetura e as tecnologias poderão sofrer ajustes durante as etapas.
