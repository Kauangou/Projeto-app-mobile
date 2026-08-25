# Proposta do Projeto

> Etapa 01 — Proposta e Planejamento da Aplicação Mobile

## 1. Nome da aplicação

**App Serviços Gerais** — *"Conecte-se a quem faz."*

(Nome provisório: poderá ser ajustado ao longo do semestre, conforme item 4 das regras do projeto da disciplina.)

## 2. Problema que a aplicação pretende resolver

Profissionais autônomos de serviços gerais — pintores, pedreiros, encanadores, eletricistas, jardineiros, montadores de
móveis, técnicos de ar-condicionado, diaristas/empregadas domésticas, costureiras, entre outros — geralmente têm **pouca
visibilidade digital**. Eles dependem quase exclusivamente de indicação boca a boca, o que limita seu alcance a novos
clientes e dificulta a divulgação do seu trabalho.

Do lado do cliente, encontrar um profissional confiável para esse tipo de serviço costuma ser feito de forma informal
(grupos de WhatsApp, redes sociais, indicação de vizinhos), sem nenhuma centralização de informações como avaliações,
portfólio de trabalhos anteriores, região de atendimento ou forma de contato.

**A solução busca resolver esses dois problemas ao mesmo tempo**, funcionando como uma vitrine virtual para prestadores
de serviços gerais e um canal simples de busca e contato para quem precisa contratar esses serviços.

## 3. Público-alvo

O aplicativo tem dois perfis de usuário:

1. **Prestadores de serviço** — profissionais autônomos de áreas com pouca visibilidade digital (pintores, pedreiros,
   encanadores, eletricistas, jardineiros, montadores, técnicos de ar-condicionado, diaristas, costureiras, etc.), que
   querem divulgar seu trabalho e conquistar novos clientes.
2. **Clientes** — moradores, proprietários de imóveis, síndicos e pequenas empresas que precisam contratar esse tipo de
   serviço e buscam praticidade e confiança na escolha do profissional.

## 4. Objetivo principal

Facilitar a conexão entre clientes e prestadores de serviços gerais por meio de uma plataforma mobile onde o
profissional cria um perfil (vitrine) com suas informações, área de atuação e portfólio, e o cliente pode buscar,
avaliar e entrar em contato com esses profissionais de forma centralizada.

## 5. Descrição das principais funcionalidades

Funcionalidades previstas para a evolução completa do projeto ao longo do semestre (nem todas implementadas nesta
etapa — a implementação será incremental):

- Cadastro/login com dois tipos de perfil: **Cliente** e **Prestador**;
- Criação e edição do perfil do prestador (categoria de serviço, descrição, fotos de portfólio, região de atuação, valor
  de referência);
- Busca e filtro de prestadores por categoria de serviço e localização;
- Visualização detalhada do perfil do prestador (fotos, avaliações, botão de contato);
- Sistema de avaliação e comentários de clientes sobre prestadores;
- Lista de favoritos para o cliente;
- Contato direto com o prestador (ex.: link para WhatsApp);
- *(Evoluções futuras)* agendamento de serviços, chat interno, notificações push, localização em mapa.

## 6. Telas previstas (mínimo de 4)

| # | Tela                    | Descrição                                                                      |
|---|-------------------------|--------------------------------------------------------------------------------|
| 1 | **Splash / Onboarding** | Tela inicial de abertura do app.                                               |
| 2 | **Login / Cadastro**    | Autenticação e escolha do tipo de perfil (Cliente ou Prestador).               |
| 3 | **Home**                | Categorias de serviço em destaque e prestadores sugeridos.                     |
| 4 | **Busca / Resultados**  | Lista de prestadores filtrada por categoria e/ou localização.                  |
| 5 | **Perfil do Prestador** | Detalhes do profissional: fotos, descrição, avaliações e botão de contato.     |
| 6 | **Perfil do Usuário**   | Dados da conta, favoritos e configurações (versão cliente e versão prestador). |

## 7. Fluxo básico de navegação

```
Splash
  └──> Login / Cadastro ──> (novo usuário escolhe perfil: Cliente | Prestador)
                                          │
                                          ▼
                                        Home
                        ┌─────────────────┼─────────────────┐
                        ▼                 ▼                 ▼
                  Busca/Resultados   Favoritos          Perfil do Usuário
                        │                 │
                        ▼                 ▼
              Perfil do Prestador ──> Contato (WhatsApp/telefone)
```

- Navegação principal por **Bottom Tab Navigator** (Home, Busca, Favoritos, Perfil).
- Cada aba possui um **Stack Navigator** próprio para telas de detalhe (ex.:
  da Home ou da Busca é possível empilhar a tela de Perfil do Prestador).

## 8. Tecnologia escolhida para o desenvolvimento mobile

**React Native (com Expo).**

Justificativa:

- Permite desenvolver para Android e iOS a partir de uma única base de código;
- Grande comunidade, documentação abundante e curva de aprendizado adequada ao cronograma da disciplina;
- Boa integração com bibliotecas de navegação (React Navigation) e armazenamento local (AsyncStorage / SQLite via
  `expo-sqlite`);
- O uso do Expo facilita testar a aplicação em dispositivo físico via Expo Go durante o desenvolvimento incremental, sem
  necessidade de configurar ambiente nativo completo desde o início.

## 9. Tecnologia escolhida para o backend (caso exista)

**Ainda não definida.** Nesta primeira etapa, o projeto não utilizará backend próprio — os dados serão simulados
localmente (ver item 11). A decisão entre backend próprio (ex.: Node.js + Express + PostgreSQL) ou um serviço gerenciado
(ex.: Firebase) será tomada e justificada em etapa futura, quando forem implementados cadastro persistente multiusuário,
autenticação real e sincronização de dados entre dispositivos.

## 10. Necessidade de comunicação com APIs externas

Não é obrigatória nesta etapa. Futuramente está prevista a possível integração com:

- uma **API de geolocalização/mapas** (ex.: Google Maps ou OpenStreetMap)
  para localizar prestadores próximos ao cliente;
- um **link direto para o WhatsApp** (`wa.me`) como canal de contato entre cliente e prestador.

Essas integrações serão avaliadas e implementadas conforme a pertinência nas etapas seguintes, de acordo com o item 1
das regras da disciplina.

## 11. Forma prevista de armazenamento de dados

Nesta etapa, os dados (categorias de serviço, prestadores de exemplo, favoritos) são simulados por meio de um arquivo
JSON local (`src/data/mockProviders.json`) e persistidos no dispositivo usando **AsyncStorage** (ex.: para salvar
favoritos e o perfil do usuário logado). A persistência em servidor/nuvem será avaliada e implementada em etapas
futuras, conforme a definição do backend (item 9).

## 12. Principais decisões técnicas (resumo)

| Decisão                                | Justificativa                                                                                          |
|----------------------------------------|--------------------------------------------------------------------------------------------------------|
| React Native + Expo                    | Multiplataforma, produtividade e facilidade de testes durante o semestre.                              |
| React Navigation (Bottom Tabs + Stack) | Padrão de mercado para apps com múltiplas seções e telas de detalhe.                                   |
| Sem backend nesta etapa                | Foco inicial em fluxo de telas, navegação e estrutura do projeto; dados mockados localmente.           |
| AsyncStorage para persistência local   | Simples, nativo do ecossistema React Native, suficiente para favoritos e sessão do usuário nesta fase. |

*Decisões técnicas adicionais serão registradas em `docs/arquitetura.md` conforme o projeto evoluir.*

## 13. Repositório Git e estrutura inicial

O repositório já contém a estrutura inicial de diretórios definida nas regras da disciplina (ver `README.md` para
detalhes) e a tag **`etapa-01`** marcando esta entrega.

## 14. Observação sobre evolução do escopo

Esta proposta será usada como referência para as próximas etapas e poderá ser ajustada ao longo do semestre.
