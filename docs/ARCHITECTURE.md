# Arquitetura — JOQBAY / 3D Parametric Studio

## 1. Objetivo e fronteiras

O sistema atual é uma **demonstração estática com UI e renderização 3D reais**. Ele não implementa backend, domínio de produção, autenticação, cálculo de fabricação ou integração com SketchUp.

A estrutura foi escolhida para facilitar a migração para uma API NestJS mais adiante **sem misturar responsabilidades de Vue, Three.js e domínio**.

## 2. Fluxo dos dados

```text
Usuário → StudioControls.vue → CabinetConfig (contrato)
                                      ↓
                         createLocalCabinetPreview
                               (mock local)
                                      ↓
                         PreviewResult / PanelData[]
                                      ↓
                       CabinetViewport.vue (Vue)
                                      ↓
                   createCabinetRenderer (Three.js)
                                      ↓
                         Mesh, Geometry, Camera
```

- `StudioControls.vue` coleta informações; não determina geometria.
- `contracts/studio.ts` descreve dados em milímetros; não importa Vue ou Three.
- `application/localPreviewAdapter.ts` **simula** uma possível resposta do futuro servidor; possui cálculos geométricos conceituais limitados. **Não é domínio de fabricação.**
- `three/cabinetRenderer.ts` é um adaptador técnico que converte milímetros para unidades da cena (1 unidade = 1000 mm) e desenha. Não define espessuras permitidas ou cortes.
- `CabinetViewport.vue` gerencia montagem, desmontagem e atualização do renderer com Vue.

## 3. Decisão: mock substituível em vez de NestJS agora

Não existe servidor em execução. Não usamos credenciais, banco, autenticação simulada ou endpoint falso que pareça real. O protótipo é barato para hospedar e permite avaliar o comportamento no navegador.

Numa etapa futura, introduzir um **port de aplicação**, por exemplo `CabinetPreviewGateway`, e um adaptador HTTP implementado com `fetch`. O contrato deverá ser revisado conforme os requisitos de negócio e versionado.

```text
Vue ──► CabinetPreviewGateway
           ├─ LocalPreviewAdapter (agora, demonstração)
           └─ HttpCabinetAdapter (futuro)
                    │
                    └─ NestJS Controller → Application → Domain
```

No NestJS, o domínio deve permanecer independente de controllers HTTP, banco, Three.js e Vue. Não confundir TypeScript (linguagem) com backend (processo/serviço).

## 4. Convenções da cena 3D

- Contratos geométricos: **milímetros**.
- Renderização: **metros como unidade de cena**, uma convenção do adaptador Three.js.
- Eixos: X horizontal, Y vertical, Z profundidade.
- Posições em `PanelData.position` são centros dos painéis; peças independentes.
- Esquema visual de cinco painéis: laterais, base, tampo e fundo interno.
- Não há regras para folgas de portas, gavetas, fitagem, usinagem, tolerâncias industriais, ferragens ou CNC.
- `estimatedAreaM2`, quando apresentado num contrato, é mera referência geométrica — não é plano de corte nem consumo liquidado.

## 5. Responsabilidades técnicas

- **Three Renderer**: tem seu próprio lifecycle de WebGL, `OrbitControls`, raycaster, ResizeObserver e `dispose()` para liberar materiais, geometrias e listeners.
- **Vue**: transmite props e recebe seleção de painéis; não mantém uma árvore Three.js dentro do estado de negócio.
- **Theme**: preferências persistidas no navegador; sem banco.
- **Draft**: a configuração local é guardada no localStorage com validação de carregamento; não é uma conta nem um projeto salvo na nuvem.

## 6. Estratégia de testes

- **Unitários**: testar pureza e invariantes do adaptador local (no futuro, testes autoritativos migram para o servidor).
- **Componente**: o `App` é montado com um viewport 3D substituído por mock, porque jsdom não oferece WebGL.
- **Manual**: validar renderização e orbit/pick em Chrome e Edge; temas dark/light; mobile 320/390/768 px.
- **E2E futuro**: adicionar Playwright para configurar e ver resultados em browsers reais quando a stack de UI estabilizar.

## 7. Segurança e honestidade técnica

Esta demo não possui login, banco ou dados pessoais. O visitante não pode inferir que peças renderizadas estão prontas para fabricação. Na migração para NestJS, toda entrada deve ser validada novamente no servidor; validação HTML é somente conveniência de interface.

## Evolução v0.2 — estrutura e composição

- `src/application/localPreviewAdapter.ts` produz modelos **nominais de apresentação**: alternância de lados passantes / horizontais passantes, tampo e base até a profundidade externa, fundo visual de 6 mm, portas ou frentes de gaveta simbólicas. Não contém regras de fabricação certificadas.
- `src/application/kitchenComposition.ts` compõe quatro modelos usando **o mesmo contrato** `CabinetPreview` e mantém IDs por módulo (`counter/left`, `drawers/drawer-front-1`, ...). Cada painel pode informar sua cor, sem acoplar o gerador geométrico ao Three.js.
- `src/views/EnvironmentView.vue` é responsável por apresentação, seleção e edição do módulo selecionado. Não calcula a posição dos painéis.
- `src/three/cabinetRenderer.ts` interpreta dados no espaço da cena; a vista explodida e a rotação são **efeitos de visualização**, nunca mudanças no modelo geométrico recebido.
- A futura API NestJS poderá substituir os adaptadores de demonstração, mantendo o contrato de saída. O mapeamento visual `mm → scene units` continuará no renderer.

**Não implementado:** montagem de cozinha automática por IA, armazenamento em servidor, gavetas completas, dispositivos de fixação, rasgos de fundo, plano de corte, eletrodomésticos e iluminação fotorealista.
