# Arquitetura

> Documento vivo: será atualizado a cada etapa conforme o projeto evolui.

## Etapa 01 — Estado atual

Nesta etapa o projeto ainda não possui lógica de negócio implementada; o foco foi planejamento, definição de
telas/navegação e estrutura inicial do repositório.

### Stack planejada

- **Mobile:** React Native (Expo)
- **Navegação:** React Navigation (Bottom Tabs + Stack Navigator)
- **Estado local:** React state / Context API (a confirmar em etapas futuras, conforme complexidade)
- **Persistência local:** AsyncStorage (favoritos, sessão do usuário)
- **Dados desta etapa:** mock em JSON (`src/data/mockProviders.json`)
- **Backend:** a definir em etapa futura (ver `docs/proposta.md`, item 9)

### Estrutura de pastas (`src/`)

```
src/
├── App.js                 # ponto de entrada, monta o navigator
├── navigation/
│   └── AppNavigator.js    # bottom tabs + stacks
├── screens/                # uma tela por arquivo
├── components/             # componentes reutilizáveis
├── data/                   # dados mockados desta etapa
└── services/                # abstrações (ex.: storageService)
```

### Próximos passos (etapas futuras)

- Definir e justificar tecnologia de backend;
- Implementar cadastro/login real;
- Persistência remota dos dados;
- Testes automatizados (`tests/`).
