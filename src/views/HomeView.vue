<script setup lang="ts">
import heroImage from '@/assets/studio-hero.webp'
import { presets } from '@/application/studioPresets'
import type { CabinetKind } from '@/contracts/studio'
import UiIcon from '@/components/UiIcon.vue'
const emit = defineEmits<{
  start: []
  preset: [kind: CabinetKind]
  navigate: [view: 'templates' | 'about' | 'environment']
}>()
</script>
<template>
  <div class="home-view page-enter">
    <div class="page-intro">
      <div>
        <p class="eyebrow">WELCOME TO THE WORKSPACE</p>
        <h1>Projetar é transformar<br /><em>ideias em precisão.</em></h1>
        <p class="lead">
          Explore proporções, ajuste dimensões e visualize conceitos de marcenaria em 3D —
          diretamente no navegador.
        </p>
      </div>
      <div class="edition-marker"><span>PORTFOLIO EDITION</span><strong>2026 / 01</strong></div>
    </div>
    <section
      class="hero-stage"
      :style="{
        backgroundImage: `linear-gradient(90deg, rgba(11,20,25,.92) 2%, rgba(11,20,25,.71) 35%, rgba(11,20,25,.08) 78%), url(${heroImage})`,
      }"
      aria-label="Visualização de móvel contemporâneo"
    >
      <div class="hero-content">
        <span class="hero-kicker"
          ><UiIcon name="sparkles" :size="15" /> EXPERIENCE THE PROCESS</span
        >
        <h2>Design inteligente.<br /><span>Geometria real.</span></h2>
        <p>
          Comece por um móvel. Descubra como dimensões viram uma representação tridimensional
          interativa.
        </p>
        <button type="button" class="primary-button" @click="emit('start')">
          Iniciar configuração <UiIcon name="arrow" :size="17" />
        </button>
      </div>
      <div class="hero-index">FIG. 01 <span>—</span> EXPLORAÇÃO PARAMÉTRICA</div>
    </section>
    <div class="section-heading">
      <div>
        <span class="eyebrow">START SOMETHING</span>
        <h2>Escolha um ponto de partida</h2>
        <p>Modelos pré-configurados para explorar forma e proporção.</p>
      </div>
      <button type="button" class="text-action" @click="emit('navigate', 'templates')">
        Ver biblioteca <UiIcon name="arrow" :size="16" />
      </button>
    </div>
    <div class="preset-grid">
      <button
        v-for="(preset, index) in presets"
        :key="preset.kind"
        type="button"
        class="preset-card"
        @click="emit('preset', preset.kind)"
      >
        <div class="preset-top">
          <span>{{ preset.eyebrow }}</span
          ><UiIcon name="arrow" :size="19" />
        </div>
        <div class="preset-illustration" :class="`illustration-${index}`">
          <div class="illustration-cabinet"><div class="illustration-inset" /></div>
        </div>
        <div class="preset-footer">
          <strong>{{ preset.label }}</strong>
          <p>
            {{ preset.config.width }} × {{ preset.config.height }} × {{ preset.config.depth }} mm
          </p>
        </div>
      </button>
    </div>
    <section class="environment-promo">
      <div>
        <p class="eyebrow">NEW / COMPOSIÇÃO 3D</p>
        <h2>Uma cozinha. Vários módulos.</h2>
        <p>
          Combine balcão, gaveteiro, torre e aéreo num ambiente linear demonstrativo. Selecione e
          personalize cada volume.
        </p>
      </div>
      <button type="button" class="primary-button" @click="emit('navigate', 'environment')">
        Explorar ambiente <UiIcon name="arrow" :size="16" />
      </button>
    </section>
    <div class="features-strip">
      <div>
        <UiIcon name="cube" :size="21" /><strong>Visualização 3D</strong
        ><span>Geometria interativa em tempo real</span>
      </div>
      <div>
        <UiIcon name="sliders" :size="21" /><strong>Controle paramétrico</strong
        ><span>Dimensões ajustáveis em milímetros</span>
      </div>
      <div>
        <UiIcon name="shield" :size="21" /><strong>Engenharia evolutiva</strong
        ><span>Contratos preparados para APIs</span>
      </div>
    </div>
    <p class="disclaimer">
      Projeto experimental de portfólio. Imagens e modelos ilustrativos; não representam desenhos
      técnicos para fabricação.
    </p>
  </div>
</template>
<style scoped>
.home-view {
  max-width: 1520px;
  margin: 0 auto;
}
.page-intro {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 34px;
}
h1 {
  font-size: clamp(31px, 3.3vw, 52px);
  letter-spacing: -0.047em;
  line-height: 1.14;
  margin: 12px 0 15px;
  font-weight: 720;
}
h1 em {
  color: var(--mint);
  font-style: normal;
}
.lead {
  color: var(--muted-strong);
  max-width: 620px;
  line-height: 1.7;
  font-size: 13px;
  margin: 0;
}
.edition-marker {
  display: grid;
  gap: 7px;
  color: var(--muted);
  text-align: right;
  padding-bottom: 6px;
  letter-spacing: 0.09em;
  white-space: nowrap;
}
.edition-marker span {
  font-size: 9px;
}
.edition-marker strong {
  font-size: 12px;
  color: var(--muted-strong);
}
.hero-stage {
  height: 394px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background-color: #0b151b;
  background-position: center 52%;
  background-size: cover;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 55px #0002;
}
.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 43px 51px;
  height: 100%;
  max-width: 560px;
}
.hero-kicker {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #9fe1d0;
  font-size: 10px;
  letter-spacing: 0.15em;
  font-weight: 800;
}
.hero-content h2 {
  color: #fff;
  letter-spacing: -0.05em;
  line-height: 1.1;
  font-weight: 750;
  font-size: clamp(34px, 3.4vw, 52px);
  margin: 20px 0 11px;
}
.hero-content h2 span {
  color: #9fe1d0;
}
.hero-content p {
  color: #c0ced1;
  font-size: 13px;
  max-width: 410px;
  line-height: 1.7;
}
.hero-index {
  position: absolute;
  bottom: 20px;
  right: 25px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #d4e9e6;
}
.hero-index span {
  color: #9fe1d0;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
  margin: 47px 0 22px;
}
.section-heading h2 {
  font-size: clamp(21px, 2vw, 28px);
  margin: 9px 0 5px;
  letter-spacing: -0.03em;
}
.section-heading p {
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}
.text-action {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--mint);
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  padding-bottom: 5px;
}
.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
}
.preset-card {
  text-align: left;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--panel-bg);
  border: 1px solid var(--line);
  color: var(--text);
  border-radius: 14px;
  cursor: pointer;
  padding: 19px;
  transition:
    transform 0.17s ease,
    border-color 0.17s ease;
}
.preset-card:hover {
  transform: translateY(-3px);
  border-color: var(--mint);
}
.preset-top {
  display: flex;
  justify-content: space-between;
  color: var(--muted-strong);
  font-size: 10px;
  font-weight: 760;
  letter-spacing: 0.15em;
}
.preset-illustration {
  display: grid;
  place-items: center;
  flex: 1;
  height: 125px;
  background: radial-gradient(ellipse, #4c676c18, transparent 68%);
  perspective: 500px;
}
.illustration-cabinet {
  width: 112px;
  height: 80px;
  border: 5px solid #8a9aa0;
  border-bottom-width: 7px;
  background: linear-gradient(140deg, #313e45, #1a282f);
  transform: rotateY(-23deg) rotateX(11deg);
  box-shadow:
    14px 12px 0 #243137,
    20px 24px 30px #0003;
  display: grid;
  padding: 9px;
}
.illustration-inset {
  border: 1px solid #596d70;
  background: #142128;
}
.illustration-1 .illustration-cabinet {
  width: 126px;
  height: 58px;
  border-color: #d1c4b1;
  background: #8b806e;
  box-shadow:
    13px 11px 0 #625b4f,
    20px 24px 30px #0003;
}
.illustration-2 .illustration-cabinet {
  width: 73px;
  height: 109px;
  border-color: #586675;
  background: #283039;
  box-shadow:
    14px 10px 0 #2b333c,
    20px 24px 30px #0003;
}
.preset-footer {
  border-top: 1px solid var(--line);
  padding-top: 17px;
}
.preset-footer strong {
  font-size: 13px;
}
.preset-footer p {
  color: var(--muted);
  font-size: 11px;
  margin: 7px 0 0;
}
.features-strip {
  margin: 30px 0 10px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.features-strip > div {
  padding: 24px 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 3px 14px;
}
.features-strip > div + div {
  border-left: 1px solid var(--line);
}
.features-strip svg {
  grid-row: span 2;
  color: var(--mint);
}
.features-strip strong {
  font-size: 12px;
}
.features-strip span {
  color: var(--muted);
  font-size: 10px;
}
.disclaimer {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.6;
}
@media (max-width: 960px) {
  .preset-grid {
    gap: 11px;
  }
  .preset-card {
    padding: 14px;
  }
  .hero-stage {
    height: 355px;
  }
}
@media (max-width: 660px) {
  .page-intro {
    margin-bottom: 20px;
  }
  .edition-marker {
    display: none;
  }
  .hero-stage {
    height: 415px;
    background-position: 63% center;
  }
  .hero-content {
    padding: 26px;
    background: linear-gradient(90deg, #0b1417aa, transparent);
  }
  .hero-content h2 {
    font-size: 36px;
  }
  .hero-content p {
    max-width: 290px;
  }
  .hero-index {
    font-size: 8px;
    right: 14px;
  }
  .section-heading {
    margin-top: 35px;
    align-items: start;
  }
  .preset-grid {
    grid-template-columns: 1fr;
  }
  .preset-illustration {
    height: 108px;
  }
  .features-strip {
    grid-template-columns: 1fr;
  }
  .features-strip > div {
    padding: 19px 10px;
  }
  .features-strip > div + div {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
}
</style>

<style scoped>
.environment-promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  border: 1px solid var(--active-border);
  border-radius: 16px;
  background: linear-gradient(120deg, var(--panel-bg), var(--active-nav));
  padding: 26px;
  margin: 28px 0;
}
.environment-promo h2 {
  margin: 8px 0;
  font-size: 24px;
}
.environment-promo p:not(.eyebrow) {
  max-width: 530px;
  color: var(--muted-strong);
  font-size: 12px;
  line-height: 1.6;
}
.environment-promo .primary-button {
  white-space: nowrap;
}
@media (max-width: 760px) {
  .environment-promo {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
