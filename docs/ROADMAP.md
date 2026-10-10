# Roadmap de evolução (não implementado)

O planejamento abaixo indica direção, **não promessa de recursos existentes**.

## Etapa A — Portfólio front-end

- [x] Shell responsivo e temas dark/light
- [x] Home, configurador, modelos e explicação da arquitetura
- [x] Prévia 3D Three.js com órbita, seleção de painéis e screenshot
- [x] Contratos geométricos e adaptador local conceitual
- [x] Vitest para adaptador e smoke tests de navegação
- [ ] Testes E2E Playwright no navegador real
- [ ] Acessibilidade automatizada e testes visuais regressivos
- [ ] Publicar demo na Vercel e adicionar URL real ao README

## Etapa B — Separação de API

- [ ] Criar gateway de aplicação com contrato explícito
- [ ] NestJS / API REST / OpenAPI
- [ ] Módulos de aplicação, domínio independente, ports e adapters
- [ ] Validação de DTOs no servidor e contract tests
- [ ] Integração front-back com mocks HTTP nos testes

## Etapa C — Engenharia de produto (definir regras com responsável de domínio)

- [ ] Modelos de peças e materiais com invariantes validadas
- [ ] Regras paramétricas por famílias de móveis
- [ ] Histórico/versionamento de projetos
- [ ] Orçamentos, ferragens e outros recursos após especificação
- [ ] Serviço Python dedicado à otimização de chapas, se necessário

A integração Ruby com SketchUp pertence a **outro projeto privado**, fora do escopo deste repositório.
