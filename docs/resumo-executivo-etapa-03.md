# 📋 Resumo Executivo: Etapa 03 (Navegação, UX e Acessibilidade)

| | |
|---|---|
| **Entrega** | Tag `etapa-03` (commit `4d17f78`, 23/09/2026) |
| **Escopo do commit** | 23 arquivos alterados (+535 / −49 linhas) |
| **Ajuste posterior** | `0aa9e69` (01/10/2026): só README ("Backend e dados (Previsto)"), um patch de dependência e remoção do `.claude/launch.json` |

---

## 1. Objetivo e abordagem

**Objetivo do enunciado:** implementar um fluxo completo de navegação e aplicar princípios básicos de UX e acessibilidade, incluindo a Lei de Fitts e o uso de leitores de tela.

**Abordagem adotada:** a navegação completa já existia, desde as melhorias pós-Etapa 02. Esta etapa foi de **auditoria e reforço**: o que já atendia foi mantido, e o que estava abaixo do esperado foi corrigido e medido.

---

## 2. Requisitos do enunciado × entrega

| Requisito | Como foi atendido |
|---|---|
| Acessar diferentes funcionalidades | **16 telas** navegáveis, com experiências separadas para Cliente e Prestador. |
| Navegar entre telas | Stack raiz + abas por perfil + Stack por aba (React Navigation). |
| Retornar às telas anteriores | Seta nativa no cabeçalho, gestos do sistema e links de texto ("Já tem conta? Entrar", "Sair e continuar depois"). O "voltar" sempre retorna à lista de origem. |
| Menus, abas ou outros mecanismos | Abas inferiores diferentes por perfil, modal para o formulário de avaliação e botão fixo de contato no rodapé. |
| Feedback visual das ações | Estados do botão (pressed, disabled, loading), coração de favorito, erro por campo, banner de sucesso, `Alert` de confirmação e o novo **toast**. |
| Textos legíveis, contraste, tamanho de alvo, ações claras, mensagens compreensíveis, estados de interação | Contraste auditado, alvos ≥ 44×44 px, cabeçalhos marcados para leitor de tela e mensagens padronizadas. |

---

## 3. Estrutura de navegação

**Stack raiz** (`AppNavigator`): escolhe a área só pelo estado da sessão, sem `reset` manual nas telas.

| Estado da sessão | Área exibida |
|---|---|
| Carregando | Splash |
| Sem usuário | Login ⇄ Cadastro |
| Prestador sem vitrine | Monte sua vitrine (passo 2 do cadastro) |
| Prestador com vitrine | Abas do Prestador |
| Cliente | Abas do Cliente |

**Abas inferiores**
- **Cliente:** Início · Busca · Favoritos · Perfil
- **Prestador:** Painel · Avaliações · Perfil
- O ícone fica preenchido na aba ativa e contornado nas demais, sem depender só da cor.

**Stack por aba:** as telas de detalhe (Perfil do Prestador, Detalhe da avaliação, Avaliar, Editar vitrine) são registradas uma vez e reaproveitadas nas abas que precisam delas.

---

## 4. O que foi implementado nesta etapa

### 4.1 Feedback visual: novo **toast**

Antes, salvar ou publicar só fechava a tela, sem confirmar nada ao usuário. Agora há um aviso não-bloqueante (`Toast` + `ToastContext`) que some em cerca de 2,5 s e não intercepta toques.

| Ação | Antes | Agora |
|---|---|---|
| Salvar nome da conta | só voltava | toast "Conta atualizada" |
| Salvar vitrine | só voltava | toast "Vitrine atualizada" |
| Publicar avaliação | só voltava | toast "Avaliação publicada" |

- Favoritar **não** ganhou toast, porque o ícone já muda na hora e um aviso a cada toque seria ruído.
- O toast anuncia a mensagem ao leitor de tela via `AccessibilityInfo.announceForAccessibility`.
- Ele ficou **sem animação**. Uma versão animada não progredia no preview web, então priorizou-se a confiabilidade.

### 4.2 Contraste (WCAG 2.1 AA, calculado com a fórmula oficial)

| Cor | Antes | Depois | Contraste com texto branco |
|---|---|---|---|
| `whatsapp` | `#25D366` | `#0E7A3D` | 1,98:1 → **5,43:1** |
| `secondary` | `#F59E0B` | `#B45309` | 2,15:1 → **5,02:1** |

As demais cores do tema já passavam e foram apenas conferidas. Como tudo lê o tema centralizado, nenhum componente precisou mudar de estrutura.

### 4.3 Lei de Fitts: alvos de toque ≥ 44×44 px

Foram ampliados:
- os chips de categoria e filtro (`CategoryChip`);
- o segmento do formulário de vitrine (`SegmentedControl`);
- o botão de remover foto (`PhotoGallery`);
- os cinco links de texto de navegação secundária, que eram só o texto, com cerca de 20 px de altura.

Ações frequentes continuam ao alcance do polegar: abas fixas embaixo e o botão "Chamar no WhatsApp" fixo no rodapé.

### 4.4 Acessibilidade para leitor de tela

- `accessibilityRole="header"` nos títulos de Splash, Login, Cadastro, Monte sua vitrine, Favoritos e Sobre. Isso permite navegar de título em título.
- Os links de navegação secundária ganharam `accessibilityRole="button"` e `hitSlop`.
- Já existiam desde a etapa anterior:
  - `accessibilityRole`, `Label` e `State` nos componentes interativos;
  - rótulos compostos nos cartões;
  - `hitSlop` em botões pequenos;
  - `SafeAreaView` em todas as telas.

### 4.5 Ajuste extra: busca por nome

O filtro de nome agora compara só com o nome do prestador, e não casa mais com o nome do serviço. A função `filterProviders` ficou mais simples.

---

## 5. Entregáveis exigidos

- ✅ Fluxo de navegação implementado
- ✅ Telas e componentes atualizados
- ✅ README atualizado
- ✅ `docs/etapa-03.md` com os 7 tópicos pedidos (estrutura, telas e acessos, menus e abas, feedback, decisões de UX, acessibilidade e execução)
- ✅ Tag `etapa-03`

---

## 6. Balanço desta etapa

| Indicador | Antes | Depois |
|---|---|---|
| Confirmação de ações de salvar | Nenhuma | **Toast** em 3 ações |
| Contraste dos botões WhatsApp e secundário | 1,98:1 e 2,15:1 (reprovado) | **5,43:1 e 5,02:1** (aprovado) |
| Alvos de toque abaixo de 44 px | Chips, segmento e links | **Corrigidos** |
| Títulos acessíveis como `header` | Parcial | **Todas as telas principais** |
| Contextos de estado | 4 | **5** (`ToastContext`) |
| Telas | 16 | 16 (sem mudança estrutural) |

---

## ⚠️ Pontos de atenção

1. **Sem teste manual com VoiceOver ou TalkBack.** A verificação foi feita por leitura de código e pela árvore de acessibilidade do preview web. Validar num aparelho com leitor de tela ligado exigiria um build nativo de desenvolvimento. Isso está declarado como limitação no `docs/etapa-03.md`.
2. **A etapa foi de reforço, não de construção.** A maior parte dos requisitos já estava atendida desde as melhorias pós-Etapa 02. O `docs/etapa-03.md` separa "já existente" de "novo nesta etapa", e o resumo deve manter essa transparência.
3. **O toast não tem animação.** Foi uma decisão consciente, e o aviso por leitor de tela garante que a mensagem não se perca.
4. **Pendente de etapas futuras:** Supabase, autenticação real, testes automatizados e upload de fotos.
