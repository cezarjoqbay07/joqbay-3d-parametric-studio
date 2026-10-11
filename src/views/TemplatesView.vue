<script setup lang="ts">
import { presets, finishes } from '@/application/studioPresets'
import type { CabinetKind } from '@/contracts/studio'
import UiIcon from '@/components/UiIcon.vue'
const emit = defineEmits<{ preset: [kind: CabinetKind] }>()
</script>
<template>
  <div class="simple-page page-enter">
    <div class="simple-intro">
      <p class="eyebrow">EXPLORE / TEMPLATES</p>
      <h1>Modelos para começar.</h1>
      <p>Três modelos de partida para experimentar dimensões, proporções e acabamentos.</p>
    </div>
    <div class="template-list">
      <button
        v-for="(preset, index) in presets"
        :key="preset.kind"
        type="button"
        class="template-card"
        @click="emit('preset', preset.kind)"
      >
        <span class="template-index">0{{ index + 1 }}</span>
        <div class="template-visual" :class="preset.kind"><span class="template-shape" /></div>
        <div class="template-content">
          <span class="eyebrow">{{ preset.eyebrow }}</span>
          <h2>{{ preset.label }}</h2>
          <p>{{ preset.description }}</p>
          <span class="template-meta"
            ><span
              class="color-circle"
              :style="{ background: finishes[preset.config.finish].hex }"
            />
            {{ preset.config.width }} × {{ preset.config.height }} ×
            {{ preset.config.depth }} mm</span
          >
        </div>
        <span class="template-action"><UiIcon name="arrow" :size="18" /></span>
      </button>
    </div>
    <p class="page-caption">Todos os modelos são visuais e editáveis, não catálogos de produção.</p>
  </div>
</template>
<style scoped>
.simple-page {
  max-width: 1120px;
  margin: 0 auto;
}
.simple-intro {
  margin-bottom: 36px;
}
.simple-intro h1 {
  font-size: clamp(29px, 3.6vw, 48px);
  letter-spacing: -0.05em;
  margin: 9px 0 12px;
}
.simple-intro > p:not(.eyebrow) {
  color: var(--muted-strong);
  line-height: 1.7;
  font-size: 13px;
}
.template-list {
  display: grid;
  gap: 14px;
}
.template-card {
  cursor: pointer;
  text-align: left;
  display: grid;
  grid-template-columns: 35px 185px 1fr 40px;
  align-items: center;
  gap: 20px;
  min-height: 165px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel-bg);
  padding: 18px;
  color: var(--text);
}
.template-card:hover {
  border-color: var(--mint);
}
.template-index {
  align-self: start;
  color: var(--muted);
  font-size: 11px;
}
.template-visual {
  height: 125px;
  background: var(--card-elevated);
  border-radius: 11px;
  display: grid;
  place-items: center;
  perspective: 450px;
}
.template-shape {
  height: 72px;
  width: 98px;
  border: 6px solid #788992;
  background: #26333a;
  transform: rotateY(-24deg) rotateX(11deg);
  box-shadow:
    13px 10px 0 #283640,
    23px 16px 22px #0003;
}
.template-visual.wall .template-shape {
  height: 58px;
  width: 114px;
  border-color: #c6bcae;
  background: #7f786e;
  box-shadow:
    13px 10px 0 #595247,
    23px 16px 22px #0003;
}
.template-visual.tower .template-shape {
  width: 64px;
  height: 104px;
}
.template-content h2 {
  font-size: 19px;
  margin: 8px 0;
}
.template-content p {
  color: var(--muted-strong);
  font-size: 12px;
  line-height: 1.55;
}
.template-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  font-size: 11px;
}
.color-circle {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.template-action {
  color: var(--mint);
}
.page-caption {
  font-size: 11px;
  color: var(--muted);
  margin-top: 25px;
}
@media (max-width: 670px) {
  .template-card {
    grid-template-columns: 1fr auto;
    gap: 10px;
    padding: 15px;
  }
  .template-index {
    display: none;
  }
  .template-visual {
    grid-column: span 2;
  }
  .template-content {
    grid-column: 1;
  }
  .template-action {
    grid-column: 2;
  }
}
</style>
