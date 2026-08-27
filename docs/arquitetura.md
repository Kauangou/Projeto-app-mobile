# Arquitetura

> Documento vivo: será atualizado a cada etapa conforme o projeto evolui.

## Etapa 01 — Estado atual

Nesta etapa o projeto ainda não possui lógica de negócio implementada; o foco foi planejamento, definição de
telas/navegação e estrutura inicial do repositório.

### Stack planejada

- **Mobile:** React Native (Expo) + TypeScript
- **Navegação:** React Navigation (Bottom Tabs + Stack Navigator)
- **Estado:** Context API (sessão) + TanStack Query (dados remotos e cache)
- **Formulários:** React Hook Form + Zod
- **Persistência local:** AsyncStorage (preferências e cache) + Expo SecureStore (dados sensíveis de pequeno porte)
- **Dados desta etapa:** mock em JSON (`src/data/mockProviders.json`)
- **Backend:** Supabase (PostgreSQL, Auth e Storage), com RLS
- **Recursos nativos:** Expo Image Picker, Expo Location e Expo Linking
- **Testes:** Jest + React Native Testing Library

### Estrutura de pastas (`src/`)

```
src/
├── App.tsx                  # ponto de entrada, monta o navigator
├── navigation/
│   └── AppNavigator.tsx     # bottom tabs + stacks
├── screens/                 # uma tela por arquivo
├── components/              # componentes reutilizáveis
├── data/                    # dados mockados desta etapa
├── services/                # abstrações (ex.: supabase e storage)
├── contexts/                # estado global da sessão
├── hooks/                   # hooks de consulta e mutação
└── types/                   # tipos e contratos da aplicação
```

### Próximos passos (etapas futuras)

- Configurar projeto, tabelas e políticas RLS no Supabase;
- Implementar cadastro/login real;
- Integrar persistência remota e upload de imagens;
- Implementar testes automatizados (`tests/`).
