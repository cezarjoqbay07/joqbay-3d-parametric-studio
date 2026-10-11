<script setup lang="ts">
import { computed, ref } from 'vue'
import { createLocalCabinetPreview } from '@/application/localPreviewAdapter'
import { finishes } from '@/application/studioPresets'
import type { CabinetConfig } from '@/contracts/studio'
import StudioControls from '@/components/StudioControls.vue'
import CabinetViewport from '@/components/CabinetViewport.vue'
import UiIcon from '@/components/UiIcon.vue'

const props = defineProps<{ modelValue: CabinetConfig }>()
const emit = defineEmits<{ 'update:modelValue': [config: CabinetConfig] }>()
const selectedId = ref<string | null>(null)
const result = computed(() => createLocalCabinetPreview(props.modelValue))
const preview = computed(() => (result.value.ok ? result.value.data : null))
const errors = computed(() => (result.value.ok ? [] : result.value.errors))
const selectedPanel = computed(() =>
  preview.value?.panels.find((panel) => panel.id === selectedId.value),
)
const format = (value: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value)
function exportJson() {
  if (!preview.value) return
  const content = JSON.stringify(
    { source: 'local-demo', configuration: props.modelValue, preview: preview.value },
    null,
    2,
  )
  const href = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = href
  link.download = 'joqbay-studio-preview.json'
  link.click()
  URL.revokeObjectURL(href)
}
</script>
<template>
  <div class="studio-view page-enter">
    <div class="studio-page-head">
      <div>
        <p class="eyebrow">PARAMETRIC WORKSPACE / 01</p>
        <h1>Configurador <span>3D.</span></h1>
        <p>
          Da dimensão às peças. Configure estrutura, portas e acabamento do seu módulo e explore
          cada painel na cena interativa.
        </p>
      </div>
      <div class="head-tags">
        <span class="tag accent"><span class="pulse" /> Geometria reativa</span
        ><span class="tag">Vue + TypeScript + Three.js</span>
      </div>
    </div>
    <div class="studio-layout">
      <aside class="studio-controls">
        <StudioControls
          :model-value="modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </aside>
      <div class="studio-main">
        <div class="stage-card">
          <CabinetViewport
            v-if="preview"
            :model="preview"
            :color="finishes[modelValue.finish].hex"
            :selected-id="selectedId"
            @select="selectedId = $event"
          />
          <div v-else class="invalid-preview">
            <UiIcon name="info" :size="26" /><strong>Confira as dimensões</strong>
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>
        </div>
        <div class="stage-metrics">
          <div>
            <span>LARGURA</span><strong>{{ format(modelValue.width) }} <small>mm</small></strong>
          </div>
          <div>
            <span>ALTURA</span><strong>{{ format(modelValue.height) }} <small>mm</small></strong>
          </div>
          <div>
            <span>PROFUNDIDADE</span
            ><strong>{{ format(modelValue.depth) }} <small>mm</small></strong>
          </div>
          <div>
            <span>PAINÉIS</span><strong>{{ preview?.panels.length ?? '—' }}</strong>
          </div>
        </div>
      </div>
    </div>
    <section class="panel-section">
      <div class="panel-section-heading">
        <div>
          <p class="eyebrow">CONCEPTUAL PARTS</p>
          <h2>Peças da prévia geométrica</h2>
          <p>Selecione uma peça na lista ou diretamente no 3D para destacá-la.</p>
        </div>
        <button type="button" class="secondary-button" :disabled="!preview" @click="exportJson">
          <UiIcon name="download" :size="16" /> Exportar JSON
        </button>
      </div>
      <div v-if="preview" class="parts-grid">
        <button
          v-for="panel in preview.panels"
          :key="panel.id"
          type="button"
          class="part-card"
          :class="{ selected: selectedId === panel.id }"
          :aria-pressed="selectedId === panel.id"
          @click="selectedId = selectedId === panel.id ? null : panel.id"
        >
          <span class="part-mark"><UiIcon name="layers" :size="18" /></span>
          <div>
            <strong>{{ panel.label }}</strong
            ><span>{{ panel.size.map(format).join(' × ') }} mm</span>
          </div>
          <span class="part-indicator">{{ selectedId === panel.id ? '●' : '○' }}</span>
        </button>
      </div>
      <p v-if="selectedPanel" class="selected-caption">
        Painel selecionado: <strong>{{ selectedPanel.label }}</strong
        >. Dimensões em milímetros; representação somente visual.
      </p>
      <div class="technical-note">
        <UiIcon name="info" :size="17" />
        <p>
          <strong>Nota técnica:</strong> esta prévia demonstra geometria e interação. Não contempla
          encaixes, ferragens, usinagem, fitagem, tolerâncias ou instruções de corte. O domínio de
          fabricação será implementado e validado no backend em uma etapa futura.
        </p>
      </div>
    </section>
  </div>
</template>
<style scoped>
.studio-view {
  max-width: 1600px;
  margin: 0 auto;
}
.studio-page-head {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
  margin-bottom: 27px;
}
.studio-page-head h1 {
  margin: 7px 0 9px;
  font-size: clamp(31px, 3vw, 45px);
  letter-spacing: -0.04em;
}
.studio-page-head h1 span {
  color: var(--mint);
}
.studio-page-head p:not(.eyebrow) {
  margin: 0;
  color: var(--muted-strong);
  font-size: 12px;
  line-height: 1.6;
}
.head-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  gap: 8px;
  margin-bottom: 3px;
}
.tag {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 11px;
  font-size: 10px;
  color: var(--muted-strong);
  background: var(--panel-bg);
}
.tag.accent {
  color: var(--mint);
  border-color: var(--active-border);
}
.pulse {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mint);
  margin-right: 6px;
}
.studio-layout {
  display: grid;
  grid-template-columns: minmax(260px, 325px) minmax(0, 1fr);
  align-items: start;
  gap: 20px;
}
.studio-controls {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel-bg);
  padding: 23px;
}
.studio-main {
  min-width: 0;
}
.stage-card {
  height: min(57vw, 555px);
  min-height: 405px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 22px;
  overflow: hidden;
}
.stage-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid var(--line);
  background: var(--panel-bg);
  border-radius: 13px;
  margin-top: 13px;
}
.stage-metrics > div {
  padding: 18px 14px;
  display: grid;
  gap: 8px;
}
.stage-metrics > div + div {
  border-left: 1px solid var(--line);
}
.stage-metrics span {
  font-size: 9px;
  color: var(--muted);
  font-weight: 700;
  letter-spacing: 0.12em;
}
.stage-metrics strong {
  font-size: 17px;
  font-variant-numeric: tabular-nums;
}
.stage-metrics small {
  color: var(--muted);
  font-size: 10px;
  font-weight: 400;
}
.invalid-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  background: var(--panel-bg);
  padding: 22px;
}
.invalid-preview svg {
  color: var(--mint);
}
.invalid-preview strong {
  font-size: 16px;
}
.invalid-preview p {
  margin: 0;
  font-size: 12px;
  color: var(--muted-strong);
}
.panel-section {
  margin-top: 34px;
}
.panel-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 17px;
}
.panel-section-heading h2 {
  margin: 6px 0;
  font-size: 21px;
  letter-spacing: -0.02em;
}
.panel-section-heading p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
}
.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 10px;
}
.part-card {
  display: flex;
  align-items: center;
  min-width: 0;
  text-align: left;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 11px;
  color: var(--text);
  background: var(--panel-bg);
  padding: 14px;
  cursor: pointer;
}
.part-card:hover,
.part-card.selected {
  border-color: var(--mint);
}
.part-mark {
  color: var(--mint);
  background: var(--mint-halo);
  height: 31px;
  width: 31px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 8px;
}
.part-card > div {
  display: grid;
  gap: 6px;
  min-width: 0;
}
.part-card strong {
  font-size: 11px;
  white-space: nowrap;
}
.part-card div span {
  font-size: 10px;
  color: var(--muted);
  white-space: nowrap;
}
.part-indicator {
  margin-left: auto;
  color: var(--mint);
  font-size: 11px;
}
.selected-caption {
  color: var(--muted-strong);
  font-size: 11px;
  margin: 14px 0 0;
}
.selected-caption strong {
  color: var(--mint);
}
.technical-note {
  display: flex;
  align-items: start;
  gap: 12px;
  background: var(--mint-halo);
  border: 1px solid var(--active-border);
  padding: 16px 18px;
  border-radius: 11px;
  margin-top: 20px;
  color: var(--muted-strong);
}
.technical-note svg {
  color: var(--mint);
  flex-shrink: 0;
}
.technical-note p {
  font-size: 11px;
  line-height: 1.7;
  margin: 0;
}
.technical-note strong {
  color: var(--text);
}
@media (max-width: 1150px) {
  .studio-layout {
    grid-template-columns: 290px minmax(0, 1fr);
    gap: 12px;
  }
  .studio-controls {
    padding: 17px;
  }
  .head-tags {
    display: none;
  }
}
@media (max-width: 780px) {
  .studio-layout {
    grid-template-columns: 1fr;
  }
  .studio-controls {
    order: 2;
  }
  .studio-main {
    order: 1;
  }
  .stage-card {
    height: 460px;
  }
  .studio-page-head {
    margin-bottom: 18px;
  }
}
@media (max-width: 540px) {
  .stage-card {
    height: 370px;
    min-height: 350px;
  }
  .stage-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  .stage-metrics > div:nth-child(3) {
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .stage-metrics > div:nth-child(4) {
    border-top: 1px solid var(--line);
  }
  .parts-grid {
    grid-template-columns: 1fr;
  }
  .panel-section-heading {
    align-items: start;
  }
  .panel-section-heading p:not(.eyebrow) {
    line-height: 1.6;
  }
  .secondary-button {
    padding: 10px;
    font-size: 10px;
  }
}
</style>
