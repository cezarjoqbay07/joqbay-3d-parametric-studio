# Entrega 0.2 — Balcões e composição de cozinha

## Escopo

Esta atualização é incremental sobre a **v0.1 do portfólio web**, não sobre o plugin privado SketchUp. Ela não implementa backend NestJS, sistema de usuários ou configuração para fabricação.

### Mudanças de produto

1. A terminologia pública **Base** passa a ser **Balcão**.
2. Estrutura configurável: **laterais passantes** ou **tampo/base passantes**.
3. Fundo visual fixo de **6 mm**, com profundidade total para topo e base.
4. Frente selecionável: aberta, duas portas ou três frentes de gaveta ilustrativas.
5. Quatro cores: grafite, carvalho, linho e branco TX.
6. Ambiente demonstrativo: balcão, gaveteiro, torre fria (sem geladeira) e aéreo.
7. Seleção e edição de dimensões/acabamento por módulo na composição.
8. Vista explodida animada, rotação automática e puxadores ilustrativos no renderizador.

### Regras de visualização (não industriais)

- Todos os valores são nominais, em milímetros; as peças são caixas prismáticas.
- A espessura estrutural continua independente da espessura visual do fundo.
- A traseira do fundo é alinhada ao plano externo traseiro; não há rebaixo, canal nem tolerância construtiva calculada.
- Portas e frentes são volumes superficiais, sem dobradiças, gavetas, folgas técnicas ou dispositivos.
- O aéreo da cozinha é posicionado num nível ilustrativo de 1.500 mm; não há aprovação ergonômica.
- O adaptador local continua substituível pelo futuro serviço de cálculo do NestJS.

## Aceitação manual

- [ ] Selecionar **Balcão**, **Aéreo** e **Torre** nos modelos.
- [ ] Alterar a estrutura e observar diferença entre largura das peças horizontais e altura das laterais.
- [ ] Confirmar profundidade nominal do tampo/base e fundo de 6 mm na lista de painéis.
- [ ] Alternar portas/frentes de gaveta/aberto.
- [ ] Alternar os quatro acabamentos.
- [ ] Abrir **Ambiente cozinha**, clicar em cada módulo e alterar dimensões individualmente.
- [ ] Ativar/desativar giro automático e vista explodida; retornar ao estado normal.
- [ ] Validar desktop e tela mobile; testar temas escuro e claro.
- [ ] Executar `npm run test:ci`, `npm run type-check`, `npm run lint:check` e `npm run build` sem erros.

## Workflow Git sugerido

```powershell
git switch main
git pull --ff-only origin main
git switch -c feature/kitchen-composition-v0-2
# aplicar patch, instalar dependências, executar quality gate
git add .
git diff --staged --check
git commit -m "feat: adiciona composição de cozinha e estruturas configuráveis"
git push -u origin feature/kitchen-composition-v0-2
```

Faça o merge por Pull Request após a validação manual e automatizada.
