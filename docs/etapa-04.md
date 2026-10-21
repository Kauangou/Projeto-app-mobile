# Etapa 04: Persistência Local de Dados

Nesta etapa os dados criados pelo usuário passam a **permanecer no
dispositivo** depois que o app é fechado e reaberto. A base de persistência
(AsyncStorage) já havia sido introduzida nas
["melhorias pós-Etapa 02"](arquitetura.md#melhorias-pós-etapa-02--perfis-separados-vitrine-e-persistência-local);
esta etapa **audita e completa** o ciclo de vida dos dados (criar, armazenar,
recuperar, atualizar, remover, apresentar), documenta o mecanismo e o
procedimento de verificação, e acrescenta o que faltava para o CRUD estar
completo:

| Operação | Já existia | Adicionado nesta etapa |
| -------- | ---------- | ---------------------- |
| Criar    | conta, vitrine, avaliação, favorito, foto do portfólio | — |
| Armazenar / Recuperar | `storage.ts` + hidratação nos *providers* | — |
| Atualizar | nome da conta, vitrine, notificações | — |
| Remover  | favorito, foto do portfólio | **excluir avaliação própria**, **excluir conta** (com dados locais) |

## 1. Mecanismo de persistência utilizado

**AsyncStorage** (`@react-native-async-storage/async-storage`, v2.2.0): banco
chave-valor assíncrono e não criptografado, mantido no armazenamento privado do
app (no web, usa o `localStorage` do navegador). Todo acesso passa por um único
módulo, [`src/storage/storage.ts`](../src/storage/storage.ts), que:

- aplica o prefixo `@asg/` a todas as chaves, evitando colisão com outros dados;
- serializa/desserializa JSON (`getJSON`, `setJSON`, `removeKey`);
- **nunca lança exceção**: falha de leitura devolve o valor padrão e falha de
  escrita é ignorada (o estado em memória continua válido), para o app não
  travar por causa do armazenamento.

## 2. Justificativa da escolha

- **É o mecanismo padrão do ecossistema Expo/React Native** para dados simples,
  funciona no Expo Go (sem build nativo) e em Android, iOS e web com a mesma
  API.
- **O volume e o formato dos dados combinam com chave-valor**: poucas coleções
  pequenas (contas, vitrines, avaliações, favoritos), sempre lidas por inteiro
  na abertura do app e mantidas em memória nos *contexts*. Não há consultas
  relacionais nem milhares de registros que justifiquem SQLite
  (`expo-sqlite`) com esquema e migrações.
- **Combina com a arquitetura atual**: os *contexts* (Auth, Providers,
  Favorites, Settings) já são a fonte de verdade em memória; o AsyncStorage
  entra só como espelho durável, e a UI não precisa saber que ele existe.
- **Facilita a migração para o Supabase** (etapa futura): como as telas só
  falam com os *contexts*, trocar o espelho local por chamadas remotas fica
  restrito a essas camadas.
- **Limitação assumida**: o AsyncStorage não é criptografado. Por isso as senhas
  das contas locais aqui salvas servem apenas à simulação de login desta
  etapa; a autenticação real (Supabase Auth) está planejada. O README já cita
  o Expo SecureStore para dados sensíveis na fase de autenticação real.

## 3. Estrutura dos dados armazenados

Chaves no AsyncStorage (todas precedidas por `@asg/`):

| Chave | Conteúdo | Tipo (`src/types`) |
| ----- | -------- | ------------------ |
| `accounts` | contas cadastradas | `StoredAccount[]` |
| `session` | usuário logado (sem senha), ou ausente após sair | `AuthUser` |
| `providers` | vitrines criadas ou alteradas e avaliações novas, indexadas pelo id do prestador | `Record<string, ProviderRecord>` |
| `favorites/<email>` | ids dos prestadores favoritos do usuário | `string[]` |
| `settings/<email>` | preferências do usuário | `{ notificationsEnabled: boolean }` |

Exemplo (`@asg/providers`, após avaliar a prestadora de id `7`):

```json
{
  "7": {
    "id": "7",
    "name": "Patrícia Gomes",
    "categoryId": "diarista",
    "city": "Goiânia",
    "state": "GO",
    "description": "…",
    "priceReference": "…",
    "phone": "…",
    "portfolio": [],
    "reviews": [
      {
        "id": "7-1761000000000",
        "authorName": "Usuário Teste",
        "authorEmail": "teste@email.com",
        "rating": 5,
        "comment": "…",
        "date": "2026-10-21",
        "service": "Limpeza completa",
        "photos": []
      }
    ]
  }
}
```

Decisões de modelagem:

- **Dados de exemplo ficam no JSON do projeto** (`src/data/*.json`) e **não são
  copiados** para o armazenamento. Só o que o usuário cria ou altera é salvo,
  como *sobrescrita* do registro por id; na leitura os dois são mesclados
  ([`ProvidersContext`](../src/contexts/ProvidersContext.tsx)). Assim o app
  continua recebendo atualizações dos dados de exemplo sem perder o que o
  usuário fez.
- **Nota média e total de avaliações não são armazenados**: são calculados a
  partir da lista de avaliações (`src/utils/rating.ts`), evitando
  inconsistência quando uma avaliação é criada ou excluída.
- **Favoritos e preferências são separados por e-mail**, então cada conta no
  aparelho tem os seus.
- **Fotos** são guardadas como URI local do aparelho (não os bytes da imagem).
- **Contas de exemplo** (`teste@email.com`, `prestador@email.com`) são
  recriadas na abertura caso não existam no armazenamento.

## 4. Operações de persistência implementadas

Todas as escritas acontecem no mesmo instante da alteração em memória; todas as
leituras acontecem uma vez na abertura do app (hidratação), enquanto a Splash é
exibida.

| Operação | Função | Contexto | Chave afetada |
| -------- | ------ | -------- | ------------- |
| **Recuperar** (abrir o app) | hidratação em `useEffect` | `AuthContext`, `ProvidersContext` | `accounts`, `session`, `providers` |
| Recuperar (ao logar) | `getJSON` no `useEffect([email])` | `FavoritesContext`, `SettingsContext` | `favorites/<email>`, `settings/<email>` |
| **Criar** conta | `register` | `AuthContext` | `accounts` |
| Criar sessão | `signIn` | `AuthContext` | `session` |
| Criar vitrine | `createProvider` | `ProvidersContext` | `providers` |
| Criar avaliação | `addReview` | `ProvidersContext` | `providers` |
| Criar favorito | `toggleFavorite` | `FavoritesContext` | `favorites/<email>` |
| Criar foto do portfólio | `addPortfolioPhoto` | `ProvidersContext` | `providers` |
| **Atualizar** nome | `updateUser` | `AuthContext` | `session`, `accounts` |
| Atualizar vitrine | `updateProvider` | `ProvidersContext` | `providers` |
| Atualizar preferência | `setNotificationsEnabled` | `SettingsContext` | `settings/<email>` |
| **Remover** sessão (sair) | `signOut` | `AuthContext` | `session` |
| Remover favorito | `toggleFavorite` | `FavoritesContext` | `favorites/<email>` |
| Remover foto do portfólio | `removePortfolioPhoto` | `ProvidersContext` | `providers` |
| **Remover avaliação** (novo) | `removeReview` | `ProvidersContext` | `providers` |
| **Remover conta** (novo) | `deleteAccount` + `removeProvider` | `AuthContext`, `ProvidersContext` | `accounts`, `session`, `favorites/<email>`, `settings/<email>`, `providers` |

Regras das operações novas:

- **Excluir avaliação**: só aparece para quem **escreveu** a avaliação (compara
  `authorEmail` com o e-mail logado) e pede confirmação. A nota média do
  prestador é recalculada automaticamente.
- **Excluir conta** (Perfil → "Excluir conta"): pede confirmação e apaga a
  conta, a sessão, os favoritos e as preferências. Se for um prestador, também
  apaga a vitrine criada por ele. Limitações: as avaliações que o usuário
  escreveu em outros prestadores permanecem (ficam com o nome do autor), e as
  contas/vitrines de **exemplo** não são apagadas de fato (as contas de exemplo
  são recriadas na próxima abertura, como descrito na seção 3).
- A confirmação usa o utilitário `confirmAction`
  ([`src/utils/feedback.ts`](../src/utils/feedback.ts)): `Alert` com botões no
  celular e `confirm` no navegador. Foi adicionada também a variante `danger`
  ao componente `Button`.

## 5. Telas que utilizam os dados persistidos

| Tela | Dados persistidos usados | Operações |
| ---- | ------------------------ | --------- |
| Splash (`SplashScreen`) | — (permanece até a hidratação terminar) | recuperar |
| Login (`LoginScreen`) | contas, sessão | recuperar, criar sessão |
| Cadastro (`RegisterScreen`) | contas | criar |
| Monte sua vitrine (`ProviderSetupScreen`) | vitrines | criar |
| Início (`HomeScreen`) | vitrines e avaliações (nota média) | apresentar |
| Busca (`SearchScreen`) | vitrines e avaliações | apresentar |
| Favoritos (`FavoritesScreen`) | favoritos + vitrines | apresentar, remover |
| Perfil do Prestador (`ProviderProfileScreen`) | vitrine, portfólio, avaliações, favoritos | apresentar, criar/remover favorito |
| Avaliar prestador (`ReviewFormScreen`) | avaliações | criar |
| Detalhe da avaliação (`ReviewDetailScreen`) | avaliações | apresentar, **remover** |
| Perfil do Usuário (`UserProfileScreen`) | conta, favoritos (contagem), avaliações feitas, preferências | apresentar, atualizar preferência, remover sessão, **remover conta** |
| Editar conta (`EditAccountScreen`) | conta | atualizar |
| Editar vitrine (`EditProviderProfileScreen`) | vitrine, portfólio | atualizar, criar/remover foto |
| Painel do Prestador (`ProviderDashboardScreen`) | vitrine, avaliações recebidas | apresentar |
| Avaliações Recebidas (`ReceivedReviewsScreen`) | avaliações recebidas | apresentar |

## 6. Instruções para execução e teste

```bash
npm install
npx expo start        # Expo Go no celular, ou pressione a/i/w (Android/iOS/Web)
```

Em redes institucionais, use `npm run tunnel` (ver README). Contas de teste em
[`README.md`](../README.md#contas-de-teste).

Roteiro para exercitar cada operação:

1. **Criar**: em "Criar conta", cadastre um usuário novo (ex.:
   `novo@email.com`) e entre. Favorite um prestador e publique uma avaliação em
   "Avaliar este prestador".
2. **Apresentar**: o favorito aparece na aba Favoritos; a avaliação aparece no
   perfil do prestador, com a nota média atualizada; o Perfil mostra as
   contagens.
3. **Atualizar**: em Perfil → "Editar nome", altere o nome e salve; alterne
   "Notificações".
4. **Remover**: desfavorite um prestador; abra a avaliação criada e toque em
   "Excluir minha avaliação"; por fim, em Perfil → "Excluir conta".

Para o prestador (`prestador@email.com` / `Teste@123`): edite a vitrine, adicione
e remova fotos do portfólio (aba Perfil → "Editar vitrine").

## 7. Procedimento de verificação da persistência (encerrar e reabrir)

Repetir para cada operação de **criar** e **atualizar** (e **remover**):

1. Entrar como `teste@email.com` / `Teste@123`, favoritar um prestador, publicar
   uma avaliação e alterar o nome em "Editar nome".
2. **Encerrar o app de verdade**:
   - celular (Expo Go): abrir o seletor de apps e arrastar o Expo Go para fora
     (ou fechar pelo gerenciador de tarefas), e depois abrir de novo e escanear
     o QR code / abrir o projeto recente;
   - web: recarregar a página (`F5`) ou fechar e reabrir a aba.
3. **Observar**: o app passa pela Splash e vai **direto para as abas**, sem
   pedir login (sessão recuperada). O favorito continua na aba Favoritos, a
   avaliação continua no perfil do prestador com a nota média e o nome
   atualizado aparece no Perfil.
4. Remover (desfavoritar, excluir a avaliação) e repetir o passo 2: os itens
   removidos **não reaparecem** após reabrir.
5. Em "Sair da conta" e reabrir o app: volta à tela de Login (a sessão foi
   removida), e ao entrar de novo os dados do usuário continuam lá.

### Resultado da verificação feita nesta etapa

Verificado na versão web (React Native Web, onde o AsyncStorage usa o
`localStorage` do navegador, o que permite inspecionar as chaves), com a conta
`teste@email.com`:

| Passo | Resultado |
| ----- | --------- |
| Favoritar "Patrícia Gomes" e publicar uma avaliação | chaves `@asg/favorites/teste@email.com` (`["7"]`) e `@asg/providers` (id `7`) e `@asg/session` presentes no armazenamento |
| Recarregar a página | app voltou direto ao Início (sessão mantida); a avaliação criada continuava listada no perfil da prestadora |
| "Excluir minha avaliação" | avaliação sumiu de `@asg/providers` (restaram só as 3 avaliações de exemplo) |
| Sair, criar conta `descartavel@email.com`, entrar e "Excluir conta" | app voltou ao Login; a conta saiu de `@asg/accounts` e a chave `@asg/session` foi removida |

**Limitação**: a verificação com o app fechado num aparelho/simulador físico
(Expo Go) não foi feita nesta etapa; o mecanismo é o mesmo AsyncStorage do
React Native, mas o roteiro da seção 7 deve ser repetido no celular para
confirmar.
