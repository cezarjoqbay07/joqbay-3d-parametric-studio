<script setup lang="ts">
import UiIcon from '@/components/UiIcon.vue'
const architecture = [
  {
    step: '01',
    name: 'Vue 3 + TypeScript',
    label: 'Experiência e interação',
    note: 'Interface, formulários, navegação e estado visual.',
  },
  {
    step: '02',
    name: 'Contrato de prévia',
    label: 'Fronteira entre camadas',
    note: 'Dados de configuração e painéis independentes do motor 3D.',
  },
  {
    step: '03',
    name: 'Adaptador local',
    label: 'Mock substituível',
    note: 'Somente demonstração; sem autoridade sobre fabricação.',
  },
  {
    step: '04',
    name: 'Three.js',
    label: 'Renderização WebGL',
    note: 'Converte painéis em geometrias e gerencia cena e câmera.',
  },
]
</script>
<template>
  <div class="about-page page-enter">
    <p class="eyebrow">INSIDE THE PROJECT</p>
    <h1>Engenharia clara.<br /><span>Experiência visível.</span></h1>
    <p class="about-lead">
      O JOQBAY 3D Parametric Studio é uma aplicação pública independente de estudo e portfólio.
      Explora arquitetura modular, testes e modelagem geométrica com tecnologias web.
    </p>
    <div class="about-highlight">
      <UiIcon name="shield" :size="28" />
      <div>
        <h2>Uma demonstração, não um software industrial</h2>
        <p>
          Este repositório não contém o código privado do plugin SketchUp, nem substitui seu motor
          de engenharia. Os cálculos atuais são conceituais e não devem orientar fabricação.
        </p>
      </div>
    </div>
    <div class="about-section-heading">
      <p class="eyebrow">ARCHITECTURE</p>
      <h2>Responsabilidades separadas</h2>
    </div>
    <div class="architecture-grid">
      <div v-for="item in architecture" :key="item.step" class="architecture-card">
        <span>{{ item.step }}</span
        ><strong>{{ item.name }}</strong
        ><small>{{ item.label }}</small>
        <p>{{ item.note }}</p>
      </div>
    </div>
    <div class="future-layout">
      <div>
        <p class="eyebrow">NEXT CHAPTER</p>
        <h2>Preparado para evoluir.</h2>
        <p>
          O contrato atual poderá ser atendido por uma API NestJS + TypeScript, onde ficarão domínio
          e regras autoritativas. Um serviço Python poderá realizar otimização de corte no futuro,
          quando houver necessidade comprovada.
        </p>
      </div>
      <div class="future-note">
        <span class="future-state">PLANEJADO · NÃO IMPLEMENTADO</span>
        <div>Frontend <strong>Vue + TypeScript</strong></div>
        <div class="future-arrow">↓ API HTTP / JSON</div>
        <div>Backend <strong>NestJS</strong></div>
        <div class="future-arrow">↓ Serviço especializado</div>
        <div>Otimização <strong>Python</strong></div>
      </div>
    </div>
    <div class="sketchup-note">
      <UiIcon name="info" :size="18" />
      <p>
        <strong>Sobre o SketchUp:</strong> existe um projeto comercial privado e separado,
        desenvolvido para integração com o SketchUp via Ruby API. Ruby é utilizado nesse contexto
        específico; não compõe o backend web desta demonstração.
      </p>
    </div>
  </div>
</template>
<style scoped>
.about-page {
  max-width: 1160px;
  margin: 0 auto;
}
.about-page h1 {
  font-size: clamp(36px, 4vw, 58px);
  line-height: 1.09;
  letter-spacing: -0.055em;
  margin: 17px 0 20px;
}
.about-page h1 span {
  color: var(--mint);
}
.about-lead {
  max-width: 720px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--muted-strong);
  margin-bottom: 37px;
}
.about-highlight {
  display: flex;
  gap: 16px;
  padding: 25px;
  border: 1px solid var(--active-border);
  border-radius: 15px;
  background: var(--mint-halo);
}
.about-highlight svg {
  color: var(--mint);
  flex-shrink: 0;
}
.about-highlight h2 {
  font-size: 16px;
  margin: 0 0 8px;
}
.about-highlight p {
  color: var(--muted-strong);
  font-size: 12px;
  line-height: 1.75;
  margin: 0;
}
.about-section-heading {
  margin: 50px 0 20px;
}
.about-section-heading h2 {
  margin: 8px 0;
  font-size: 25px;
}
.architecture-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.architecture-card {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 9px;
  background: var(--panel-bg);
  border: 1px solid var(--line);
  border-radius: 13px;
  padding: 20px;
}
.architecture-card > span {
  color: var(--mint);
  font-size: 11px;
  font-weight: 800;
}
.architecture-card strong {
  font-size: 15px;
}
.architecture-card small {
  color: var(--muted-strong);
  font-size: 11px;
}
.architecture-card p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.65;
}
.future-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: center;
  margin-top: 50px;
}
.future-layout h2 {
  font-size: 28px;
  letter-spacing: -0.04em;
}
.future-layout p:not(.eyebrow) {
  color: var(--muted-strong);
  font-size: 12px;
  line-height: 1.85;
}
.future-note {
  background: var(--panel-bg);
  border: 1px solid var(--line);
  border-radius: 14px;
  display: grid;
  gap: 10px;
  padding: 22px;
  font-size: 12px;
}
.future-note div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.future-note .future-arrow {
  color: var(--mint);
  justify-content: center;
  font-size: 10px;
}
.future-state {
  font-size: 9px;
  color: var(--mint);
  font-weight: 800;
  letter-spacing: 0.1em;
  padding-bottom: 9px;
}
.sketchup-note {
  display: flex;
  gap: 12px;
  align-items: start;
  border-top: 1px solid var(--line);
  padding-top: 22px;
  margin-top: 50px;
}
.sketchup-note svg {
  flex-shrink: 0;
  color: var(--mint);
}
.sketchup-note p {
  font-size: 11px;
  line-height: 1.85;
  color: var(--muted-strong);
  margin: 0;
}
@media (max-width: 960px) {
  .architecture-grid {
    grid-template-columns: 1fr 1fr;
  }
  .future-layout {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 540px) {
  .architecture-grid {
    grid-template-columns: 1fr;
  }
  .about-highlight {
    padding: 16px;
  }
}
</style>
