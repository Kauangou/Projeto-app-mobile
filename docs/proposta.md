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

## 8. Tecnologias escolhidas para o desenvolvimento mobile

**React Native (com Expo) e TypeScript.**

Justificativa:

- Permite desenvolver para Android e iOS a partir de uma única base de código;
- Grande comunidade, documentação abundante e curva de aprendizado adequada ao cronograma da disciplina;
- O TypeScript adiciona tipagem estática, reduzindo erros no uso de dados de
  perfis, avaliações, categorias e rotas, além de facilitar a manutenção do
  código à medida que o projeto evolui;
- Boa integração com bibliotecas de navegação (React Navigation),
  armazenamento local e recursos nativos do dispositivo;
- O uso do Expo facilita testar a aplicação em dispositivo físico via Expo Go durante o desenvolvimento incremental, sem
  necessidade de configurar ambiente nativo completo desde o início.

## 9. Tecnologia escolhida para o backend

**Supabase**, uma plataforma de backend gerenciado.

O Supabase será utilizado com **PostgreSQL** para armazenar usuários, perfis
de prestadores, categorias, avaliações e favoritos; com **Supabase Auth** para
cadastro e login por e-mail e senha; e com **Supabase Storage** para as fotos
de portfólio.

A escolha reduz a necessidade de configurar e manter um servidor próprio,
permitindo concentrar o desenvolvimento nas funcionalidades do aplicativo. A
segurança dos dados será complementada por políticas de **Row Level Security
(RLS)**, garantindo que cada usuário possa alterar apenas os recursos sob sua
responsabilidade, como seu próprio perfil, favoritos ou portfólio.

Nesta primeira etapa, a integração ainda não foi implementada e os dados
continuam simulados localmente (ver item 11).

## 10. Necessidade de comunicação com APIs externas

Não é obrigatória nesta etapa. Futuramente está prevista a possível integração com:

- os recursos nativos `expo-location` e `react-native-maps` para obter a
  localização do cliente e exibir prestadores próximos;
- um **link direto para o WhatsApp** (`wa.me`) como canal de contato entre cliente e prestador.

Para o envio de fotos ao portfólio, será utilizado o `expo-image-picker`, que
permite selecionar imagens da galeria ou da câmera do dispositivo. A abertura
do WhatsApp será feita com `expo-linking`.

Essas integrações serão avaliadas e implementadas conforme a pertinência nas etapas seguintes, de acordo com o item 1
das regras da disciplina.

## 11. Forma prevista de armazenamento de dados

Nesta etapa, os dados (categorias de serviço, prestadores de exemplo e
favoritos) são simulados por meio de arquivos JSON locais em `src/data/`.

Com a integração do backend, o Supabase será a fonte principal dos dados. No
dispositivo, o **AsyncStorage** será usado para preferências e cache simples;
o **Expo SecureStore** será reservado a dados sensíveis de pequeno porte. O
TanStack Query administrará as consultas ao backend, os estados de
carregamento/erro e a atualização do cache.

## 12. Principais decisões técnicas (resumo)

| Decisão                                | Justificativa                                                                                          |
|----------------------------------------|--------------------------------------------------------------------------------------------------------|
| React Native + Expo + TypeScript       | Multiplataforma, produtividade, tipagem estática e facilidade de testes durante o semestre.            |
| React Navigation (Bottom Tabs + Stack) | Padrão de mercado para apps com múltiplas seções e telas de detalhe.                                   |
| Supabase (PostgreSQL, Auth e Storage)  | Centraliza banco de dados, autenticação e fotos de portfólio sem manter servidor próprio.               |
| RLS no Supabase                        | Restringe o acesso de cada usuário aos dados que lhe pertencem.                                        |
| Context API + TanStack Query           | Separa o estado global simples do controle de dados remotos e cache.                                   |
| React Hook Form + Zod                  | Simplifica formulários e valida os dados antes do envio ao backend.                                    |
| AsyncStorage + Expo SecureStore        | Armazena preferências/cache e dados sensíveis de pequeno porte conforme a necessidade.                 |
| Expo Image Picker / Location / Linking | Integra galeria/câmera, localização e contato externo via WhatsApp.                                    |
| Jest + React Native Testing Library    | Permite testar componentes, fluxos e regras principais.                                                 |

*Decisões técnicas adicionais serão registradas em `docs/arquitetura.md` conforme o projeto evoluir.*

## 13. Repositório Git e estrutura inicial

O repositório já contém a estrutura inicial de diretórios definida nas regras da disciplina (ver `README.md` para
detalhes) e a tag **`etapa-01`** marcando esta entrega.

## 14. Observação sobre evolução do escopo

Esta proposta será usada como referência para as próximas etapas e poderá ser ajustada ao longo do semestre.
