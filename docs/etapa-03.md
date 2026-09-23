# Etapa 03: Navegação, UX e Acessibilidade

Esta etapa tem foco em **auditoria e reforço** de navegação, UX e
acessibilidade sobre uma base que já vinha evoluindo desde a Etapa 02: boa
parte do que o enunciado pede (fluxo de navegação completo, feedback visual
básico, rótulos de acessibilidade, alvos de toque adequados) já havia sido
implementada nas ["melhorias pós-Etapa 02"](arquitetura.md#melhorias-pós-etapa-02--perfis-separados-vitrine-e-persistência-local).
Cada seção abaixo indica o que já existia e o que foi adicionado/corrigido
agora.

## 1. Estrutura de navegação implementada

A navegação é feita com **React Navigation** em três camadas (já existente
desde a Etapa 02, sem mudanças estruturais nesta etapa):

1. **Stack raiz** ([`AppNavigator.tsx`](../src/navigation/AppNavigator.tsx)):
   decide a área exibida a partir do estado da sessão (`AuthContext`), sem
   `reset`/`navigate` manual espalhado pelas telas:

   | Estado da sessão      | Área exibida                               |
   | ---------------------- | ------------------------------------------- |
   | Carregando (`hydrated`) | `Splash`                                    |
   | Sem usuário             | `Login` ⇄ `Register`                        |
   | Prestador sem vitrine   | `ProviderSetup` (passo 2 do cadastro)       |
   | Prestador com vitrine   | `ProviderTabs` (abas do prestador)          |
   | Cliente                 | `ClientTabs` (abas do cliente)              |

2. **Abas inferiores** ([`TabNavigators.tsx`](../src/navigation/TabNavigators.tsx)):
   um conjunto de abas por perfil (ver seção 3).

3. **Stack por aba** ([`stacks.tsx`](../src/navigation/stacks.tsx)): cada aba
   tem seu próprio `Stack.Navigator`, então abrir o perfil de um prestador (ou
   qualquer tela de detalhe) a partir de qualquer aba sempre **volta para a
   lista de origem** ao apertar "voltar", nunca para uma aba diferente. As
   telas de detalhe (`ProviderProfile`, `ReviewDetail`, `ReviewForm`,
   `EditProviderProfile`) são registradas uma única vez e reaproveitadas nas
   abas que precisam delas.

Retorno ("voltar") é sempre possível: seta nativa no cabeçalho das telas
empilhadas (gesto de deslizar da borda no iOS, botão físico/gesto no Android)
ou os links de texto equivalentes ("Sair e continuar depois", "Já tem conta?
Entrar" etc.).

## 2. Telas e mecanismos de acesso

| # | Tela | Arquivo | Como se chega até ela |
|---|------|---------|------------------------|
| 1 | Splash | [`SplashScreen.tsx`](../src/screens/SplashScreen.tsx) | Abertura do app (automática, enquanto a sessão carrega) |
| 2 | Login | [`LoginScreen.tsx`](../src/screens/LoginScreen.tsx) | Automática quando não há sessão; link "Já tem conta? Entrar" no Cadastro |
| 3 | Cadastro | [`RegisterScreen.tsx`](../src/screens/RegisterScreen.tsx) | Link "Não tem conta? Criar conta" no Login |
| 4 | Monte sua vitrine | [`ProviderSetupScreen.tsx`](../src/screens/ProviderSetupScreen.tsx) | Automática no 1º login como Prestador (sem vitrine ainda) |
| 5 | Início | [`HomeScreen.tsx`](../src/screens/HomeScreen.tsx) | Aba "Início" (Cliente) |
| 6 | Busca | [`SearchScreen.tsx`](../src/screens/SearchScreen.tsx) | Aba "Busca" (Cliente); toque em categoria no Início (já filtra) |
| 7 | Favoritos | [`FavoritesScreen.tsx`](../src/screens/FavoritesScreen.tsx) | Aba "Favoritos" (Cliente) |
| 8 | Perfil do Prestador | [`ProviderProfileScreen.tsx`](../src/screens/ProviderProfileScreen.tsx) | Toque em qualquer cartão de prestador (Início, Busca, Favoritos) |
| 9 | Detalhe da avaliação | [`ReviewDetailScreen.tsx`](../src/screens/ReviewDetailScreen.tsx) | Toque em uma avaliação no Perfil do Prestador ou em Avaliações Recebidas |
| 10 | Avaliar prestador | [`ReviewFormScreen.tsx`](../src/screens/ReviewFormScreen.tsx) | Botão "Avaliar este prestador" no Perfil do Prestador (modal) |
| 11 | Perfil do Usuário | [`UserProfileScreen.tsx`](../src/screens/UserProfileScreen.tsx) | Aba "Perfil" (Cliente ou Prestador) |
| 12 | Editar conta | [`EditAccountScreen.tsx`](../src/screens/EditAccountScreen.tsx) | "Editar nome" no Perfil do Usuário |
| 13 | Sobre o app | [`AboutScreen.tsx`](../src/screens/AboutScreen.tsx) | "Sobre o app" no Perfil do Usuário |
| 14 | Editar vitrine | [`EditProviderProfileScreen.tsx`](../src/screens/EditProviderProfileScreen.tsx) | "Editar vitrine" no Painel ou no Perfil (Prestador) |
| 15 | Painel do Prestador | [`ProviderDashboardScreen.tsx`](../src/screens/ProviderDashboardScreen.tsx) | Aba "Painel" (Prestador) |
| 16 | Avaliações Recebidas | [`ReceivedReviewsScreen.tsx`](../src/screens/ReceivedReviewsScreen.tsx) | Aba "Avaliações" (Prestador); link "Ver todas" no Painel |

Total: **16 telas** navegáveis (mínimo do enunciado já era atendido desde a
Etapa 02, que tinha 8).

## 3. Menus, abas e mecanismos de navegação

- **Abas inferiores fixas**, diferentes por perfil (decisão já tomada nas
  melhorias pós-Etapa 02, mantida aqui):
  - **Cliente**: Início · Busca · Favoritos · Perfil.
  - **Prestador**: Painel · Avaliações · Perfil.
  - Ícone preenchido na aba ativa e contornado nas demais
    ([`TabNavigators.tsx`](../src/navigation/TabNavigators.tsx)): reforça
    qual aba está selecionada sem depender só da cor.
- **Cabeçalho nativo com seta de voltar** em toda tela empilhada (Editar
  conta, Sobre o app, Perfil do Prestador, Avaliar prestador etc.).
- **Links de texto para ações secundárias de navegação** ("Esqueci minha
  senha", "Criar conta", "Já tem conta? Entrar", "Sair e continuar depois",
  "Ver todas"), padronizados nesta etapa com `accessibilityRole="button"`,
  área de toque ampliada (`hitSlop`) e um pouco mais de espaçamento vertical
  (antes eram só texto clicável, sem essas marcações; ver seção 6).
- **Modal** para o formulário de avaliação (`ReviewForm`), sinalizando que é
  uma ação pontual e não parte do fluxo principal de navegação.
- **Botão de ação fixo no rodapé** do Perfil do Prestador ("Chamar no
  WhatsApp" / "Ligar"), sempre visível independente da rolagem do conteúdo.

## 4. Mecanismos de feedback visual

**Já existentes desde as melhorias pós-Etapa 02** (mantidos e não
duplicados):
- Estados `pressed` / `disabled` / `loading` no componente
  [`Button`](../src/components/Button.tsx) (ex.: "Entrar" mostra spinner
  durante o login).
- Ícone de coração preenchido/contornado no favoritar
  ([`FavoriteButton.tsx`](../src/components/FavoriteButton.tsx)).
- Mensagens de erro por campo nos formulários (React Hook Form + Zod), com
  borda vermelha no campo (`TextField`).
- Banner de sucesso "Conta criada! Entre para continuar." após o cadastro
  (`LoginScreen`).
- Confirmações importantes via `Alert` nativo (`src/utils/feedback.ts`): sair
  da conta, recuperar senha, contato por WhatsApp/ligação.

**Novo nesta etapa**: um **toast** (feedback não-bloqueante,
[`Toast.tsx`](../src/components/Toast.tsx) +
[`ToastContext.tsx`](../src/contexts/ToastContext.tsx)) para ações de
salvamento que antes eram **silenciosas** (o usuário só percebia que algo
tinha acontecido porque a tela voltava sozinha, sem nenhuma confirmação):

| Ação | Antes | Agora |
|------|-------|-------|
| Salvar nome da conta (`EditAccountScreen`) | só `navigation.goBack()` | + toast "Conta atualizada" |
| Salvar alterações da vitrine (`EditProviderProfileScreen`) | só `navigation.goBack()` | + toast "Vitrine atualizada" |
| Publicar avaliação (`ReviewFormScreen`) | só `navigation.goBack()` | + toast "Avaliação publicada" |

O toast some sozinho depois de ~2,5s e não intercepta toques (por trás dele
a tela continua utilizável), diferente do `Alert`, reservado para
confirmações que realmente precisam interromper o usuário. Ele também
**anuncia a mensagem para leitores de tela** via
`AccessibilityInfo.announceForAccessibility` (ver seção 6), já que é uma
mudança visual transitória que uma pessoa cega não veria aparecer sozinha.

Favoritar não ganhou toast: o ícone já muda de estado imediatamente
(preenchido ⇄ contornado) e isso já é sinalizado tanto visualmente quanto
para leitor de tela (`accessibilityState.selected`), então um toast a cada
toque seria redundante/ruidoso para essa ação específica, muito repetida.

## 5. Principais decisões de UX

- **Ação silenciosa é a exceção, não a regra**: qualquer ação que altera
  dados (salvar, publicar) agora tem alguma confirmação, visual (toast),
  bloqueante (`Alert`) ou de estado (ícone), escolhida conforme a frequência
  e a importância da ação (ver tabela da seção 4).
- **Alvo de toque mínimo de 44×44px** em todo elemento interativo (regra
  informal de Lei de Fitts adotada nesta etapa): alvos menores custam mais
  esforço/precisão para acertar, e o custo é maior ainda para quem tem baixa
  visão, tremor ou usa o celular andando/com uma mão só. Corrigidos nesta
  etapa: chips de categoria/filtro, segmento do formulário de vitrine, e os
  links de texto de navegação secundária (antes eram só o texto, ~20px de
  altura).
- **Ações frequentes ficam grandes e alcançáveis com o polegar**: abas fixas
  embaixo da tela, botão "Chamar no WhatsApp" fixo no rodapé do Perfil do
  Prestador. São decisões já tomadas em etapas anteriores e mantidas por
  estarem alinhadas com a Lei de Fitts (zona de alcance do polegar em telas
  grandes).
- **Contraste de cor revisado com números, não "a olho"**: duas cores do
  tema reprovavam contraste mínimo (AA, 4.5:1) quando usadas como texto/botão,
  corrigidas nesta etapa (ver seção 6, item de contraste).
- **Cabeçalhos de tela expostos como `header` para leitor de tela**: título
  de cada tela marcado com `accessibilityRole="header"`, permitindo navegar
  "pulando" de título em título (gesto padrão de VoiceOver/TalkBack) em vez
  de ouvir a tela inteira em sequência.

## 6. Medidas de acessibilidade implementadas

### Já existentes (herdadas das melhorias pós-Etapa 02)

- `accessibilityRole`, `accessibilityLabel` e `accessibilityState` na grande
  maioria dos componentes interativos (`Button`, `FavoriteButton`,
  `CategoryChip`, `SegmentedControl`, `StarRatingInput`, `ProviderCard`,
  `PhotoGallery`/`PhotoViewerModal`, `TextField` etc.).
- `hitSlop` em vários botões pequenos (ícone de favoritar, mostrar/ocultar
  senha, fechar galeria de fotos).
- Rótulos compostos em cartões (ex.: `"Patrícia Gomes, 🧹 Diarista ·
  Goiânia/GO"`) para leitura em um único toque, em vez de vários elementos
  soltos.
- `SafeAreaView`/`useSafeAreaInsets` em todas as telas.

### Adicionadas/corrigidas nesta etapa

- **Contraste de cor** (auditoria com a fórmula de contraste do WCAG 2.1,
  não visual): duas cores do tema (`src/theme/index.ts`) reprovavam o mínimo
  de 4.5:1 para texto quando usadas em botão/texto:
  - `whatsapp` (#25D366 → **#0E7A3D**): texto branco sobre a cor original
    dava 1.98:1; a nova dá 5.43:1. Afeta diretamente o botão "Chamar no
    WhatsApp" do Perfil do Prestador.
  - `secondary` (#F59E0B → **#B45309**): dava 2.15:1 como texto/botão; a
    nova dá 5.02:1. Afeta o preço em destaque nos cartões de prestador e a
    variante `secondary` do componente `Button`.
  - As demais cores do tema (texto sobre fundo, textos mudos, erro,
    outline/ghost) já passavam (17:1, 4.6 a 4.8:1, 5.2:1) e foram conferidas,
    não alteradas.
- **Cabeçalhos de tela** (`accessibilityRole="header"`) adicionados nos
  títulos que ainda não tinham: Splash, Cadastro, Monte sua vitrine,
  Favoritos, Sobre o app e Login (Busca, Avaliações Recebidas e as seções
  internas via `SectionTitle` já tinham).
- **Alvos de toque ampliados para ≥44×44px**: chips de categoria/filtro
  (`CategoryChip`), segmento do formulário de vitrine (`SegmentedControl`),
  botão de remover foto (`PhotoGallery`) e os cinco links de texto de
  navegação secundária (Login, Cadastro, Monte sua vitrine, Painel do
  Prestador), que também passaram a ter `accessibilityRole="button"` (antes
  eram lidos por leitor de tela sem indicar que eram acionáveis).
- **Feedback de ações anunciado para leitor de tela**: o toast (seção 4)
  chama `AccessibilityInfo.announceForAccessibility`, que funciona em iOS e
  Android e não depende de o usuário estar navegando perto do toast quando
  ele aparece/some.
- **Leitura pelo teclado (web) e por leitor de tela**: verificado no preview
  web (React Native Web mapeia os `accessibilityRole`/`Label`/`State` do
  React Native para a árvore de acessibilidade/ARIA do navegador): cartões
  de prestador, cabeçalhos de seção e botões aparecem corretamente com seus
  nomes e papéis (`button`, `heading` etc.) na árvore de acessibilidade.
  **Limitação**: a validação com VoiceOver real (iOS) exigiria gerar um
  build nativo de desenvolvimento (`expo run:ios`), fora do escopo desta
  etapa, que é um projeto Expo gerenciado sem pasta `ios/`; a cobertura de
  TalkBack (Android) segue no mesmo caso. A conformidade nessas duas
  plataformas se apoia nas mesmas props padrão do React Native
  (`accessibilityRole`/`Label`/`State`/`announceForAccessibility`), que são
  o mecanismo oficial de tradução para as APIs nativas de acessibilidade de
  ambas, mas não foram percorridas manualmente com o leitor de tela ligado
  num aparelho/simulador.

## 7. Instruções para execução e teste da navegação

Pré-requisitos: Node.js (LTS) e o app **Expo Go** no celular, ou um emulador
Android/iOS configurado (ver também `npm run web` para testar no navegador).

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go, ou pressione `a`/`i`/`w` no terminal
(Android/iOS/Web). Contas de teste em [`README.md`](../README.md#contas-de-teste).

Roteiro sugerido para exercitar a navegação, o feedback visual e a
acessibilidade desta etapa:

1. Entrar como **Cliente** (`teste@email.com` / `Teste@123`): navegar pelas 4
   abas; tocar numa categoria no Início (deve abrir a Busca já filtrada);
   tocar num prestador (abre o perfil, "voltar" retorna à lista de origem,
   qualquer que seja a aba de onde veio); favoritar (ícone muda na hora);
   abrir "Avaliar este prestador" (modal), publicar uma avaliação e observar
   o toast **"Avaliação publicada"** no topo da tela.
2. Na aba Perfil, abrir "Editar nome", salvar e observar o toast **"Conta
   atualizada"**; testar também "Sobre o app" e "Sair da conta" (`Alert` de
   confirmação).
3. Sair e entrar como **Prestador** (`prestador@email.com` / `Teste@123`):
   no perfil, abrir "Editar vitrine", alterar algo e salvar, toast
   **"Vitrine atualizada"**; no Painel, testar o link "Ver todas" (Avaliações
   Recebidas); abrir um perfil de prestador (o próprio ou outro) e conferir o
   botão **"Chamar no WhatsApp"** (verde escuro, texto branco legível).
4. Testar toque em áreas antes pequenas: chips de categoria na Busca,
   segmento "Cliente/Prestador" no cadastro, links "Esqueci minha senha" /
   "Criar conta". Devem responder numa área maior que o texto visível.
5. Opcional (leitor de tela): rodar `npx expo start --web`, abrir as
   ferramentas de acessibilidade do navegador (ex.: aba "Accessibility" do
   DevTools do Chrome) e conferir que títulos de tela aparecem como
   `heading` e botões como `button` com nome legível.
