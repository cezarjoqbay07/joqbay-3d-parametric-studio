<script setup lang="ts">
import { computed, ref } from 'vue'
import { createKitchenModules, createKitchenPreview } from '@/application/kitchenComposition'
import { finishes } from '@/application/studioPresets'
import type { CabinetConfig, FinishId, KitchenModule } from '@/contracts/studio'
import CabinetViewport from '@/components/CabinetViewport.vue'
import UiIcon from '@/components/UiIcon.vue'

const modules = ref<KitchenModule[]>(createKitchenModules())
const selectedModuleId = ref('counter')
const result = computed(() => createKitchenPreview(modules.value))
const preview = computed(() => (result.value.ok ? result.value.data : null))
const errors = computed(() => (result.value.ok ? [] : result.value.errors))
const selected = computed(
  () => modules.value.find((module) => module.id === selectedModuleId.value) ?? modules.value[0]!,
)

function selectFromViewport(partId: string | null) {
  const moduleId = partId?.split('/')[0]
  if (modules.value.some((module) => module.id === moduleId)) selectedModuleId.value = moduleId!
}
function updateNumber(key: 'width' | 'height' | 'depth', event: Event) {
  updateSelected({ [key]: (event.target as HTMLInputElement).valueAsNumber })
}
function updateSelected(changes: Partial<CabinetConfig>) {
  modules.value = modules.value.map((module) =>
    module.id === selectedModuleId.value
      ? { ...module, config: { ...module.config, ...changes } }
      : module,
  )
}
function resetKitchen() {
  modules.value = createKitchenModules()
  selectedModuleId.value = 'counter'
}
const dimensions = [
  { id: 'width', label: 'Largura', min: 300, max: 2400 },
  { id: 'height', label: 'Altura', min: 350, max: 2600 },
  { id: 'depth', label: 'Profundidade', min: 250, max: 900 },
] as const
</script>

<template>
  <div class="environment-view page-enter">
    <header class="environment-header">
      <div>
        <p class="eyebrow">SPACE LAB / 01 · DEMONSTRAÇÃO</p>
        <h1>Composição de <span>cozinha.</span></h1>
        <p>
          Quatro módulos em uma composição linear. Selecione um volume e ajuste suas proporções em
          tempo real.
        </p>
      </div>
      <button class="environment-reset" type="button" @click="resetKitchen">
        Restaurar composição
      </button>
    </header>

    <div class="environment-grid">
      <section class="environment-stage" aria-label="Visualização tridimensional da composição">
        <CabinetViewport
          v-if="preview"
          :model="preview"
          color="#b58c61"
          :selected-id="selectedModuleId"
          @select="selectFromViewport"
        />
        <div v-else role="alert" class="environment-invalid">
          <strong>Dimensões inválidas</strong>
          <p v-for="error in errors" :key="error">{{ error }}</p>
        </div>
      </section>
      <aside class="environment-editor">
        <div class="editor-heading">
          <span class="eyebrow">MÓDULOS DO AMBIENTE</span
          ><strong>{{ modules.length }} volumes</strong>
        </div>
        <div class="environment-module-list">
          <button
            v-for="module in modules"
            :key="module.id"
            type="button"
            class="environment-module"
            :class="{ active: selectedModuleId === module.id }"
            :aria-pressed="selectedModuleId === module.id"
            @click="selectedModuleId = module.id"
          >
            <span
              class="module-finish"
              :style="{ backgroundColor: finishes[module.config.finish].hex }"
            />
            <span class="module-info"
              ><strong>{{ module.label }}</strong>
              <small
                >{{ module.config.width }} × {{ module.config.height }} ×
                {{ module.config.depth }} mm</small
              >
            </span>
            <UiIcon name="arrow" :size="15" />
          </button>
        </div>
        <div class="editor-heading editor-subheading">
          <span class="eyebrow">PERSONALIZAR SELEÇÃO</span><strong>{{ selected.label }}</strong>
        </div>
        <div class="editor-fields">
          <label v-for="dimension in dimensions" :key="dimension.id" class="environment-field">
            <span>{{ dimension.label }} (mm)</span>
            <input
              :id="`room-${dimension.id}`"
              type="number"
              step="10"
              :min="dimension.min"
              :max="dimension.max"
              :value="selected.config[dimension.id]"
              @input="updateNumber(dimension.id, $event)"
            />
          </label>
          <label class="environment-field"
            ><span>Acabamento</span>
            <select
              id="room-finish"
              :value="selected.config.finish"
              @change="
                updateSelected({ finish: ($event.target as HTMLSelectElement).value as FinishId })
              "
            >
              <option v-for="(finish, key) in finishes" :key="key" :value="key">
                {{ finish.label }}
              </option>
            </select>
          </label>
        </div>
        <p class="editor-note">
          Prévia ilustrativa. A torre fria não contém eletrodoméstico ou ferragens; as frentes de
          gaveta não incluem caixas nem corrediças.
        </p>
      </aside>
    </div>
    <div class="environment-facts">
      <div><span>CONJUNTO</span><strong>Cozinha linear</strong></div>
      <div><span>COMPOSIÇÃO</span><strong>4 módulos independentes</strong></div>
      <div><span>TECNOLOGIA</span><strong>Vue + TypeScript + Three.js</strong></div>
    </div>
    <p class="environment-disclaimer">
      Conceito para exploração visual: sem especificações de corte, montagem, ferragens, ergonomia
      ou produção.
    </p>
  </div>
</template>

<style scoped>
.environment-view {
  max-width: 1580px;
  margin: 0 auto;
}
.environment-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 25px;
}
.environment-header h1 {
  font-size: clamp(30px, 3.4vw, 48px);
  line-height: 1.12;
  margin: 10px 0;
  letter-spacing: -0.045em;
}
.environment-header h1 span {
  color: var(--mint);
}
.environment-header p:not(.eyebrow) {
  color: var(--muted-strong);
  font-size: 12px;
  line-height: 1.7;
  max-width: 660px;
}
.environment-reset {
  border: 1px solid var(--line-strong);
  background: var(--panel-bg);
  color: var(--text);
  padding: 13px 16px;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
}
.environment-reset:hover {
  border-color: var(--mint);
}
.environment-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 16px;
}
.environment-stage {
  min-height: 570px;
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
}
.environment-editor {
  background: var(--panel-bg);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
  min-width: 0;
}
.editor-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.editor-heading strong {
  font-size: 11px;
  color: var(--muted-strong);
}
.editor-subheading {
  border-top: 1px solid var(--line);
  padding-top: 21px;
  margin-top: 20px;
}
.environment-module-list {
  display: grid;
  gap: 8px;
  margin-top: 15px;
}
.environment-module {
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: center;
  text-align: left;
  padding: 13px 11px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--text);
  cursor: pointer;
}
.environment-module.active {
  border-color: var(--mint);
  background: var(--active-nav);
}
.module-finish {
  width: 22px;
  height: 35px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #ffffff15;
}
.module-info {
  display: grid;
  flex: 1;
  gap: 5px;
  min-width: 0;
}
.module-info strong {
  font-size: 12px;
}
.module-info small {
  font-size: 10px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.editor-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 14px;
}
.environment-field {
  display: grid;
  gap: 7px;
  min-width: 0;
}
.environment-field span {
  font-size: 11px;
  color: var(--muted-strong);
}
.environment-field input,
.environment-field select {
  width: 100%;
  padding: 11px 9px;
  min-width: 0;
  border: 1px solid var(--line-strong);
  border-radius: 9px;
  background: var(--input-bg);
  color: var(--text);
  font: inherit;
  font-size: 12px;
}
.environment-field input:focus,
.environment-field select:focus {
  outline: 1px solid var(--mint);
}
.environment-field select option {
  color: #1a2028;
}
.editor-note {
  font-size: 10px;
  line-height: 1.65;
  color: var(--muted);
  margin: 19px 0 0;
}
.environment-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}
.environment-facts > div {
  display: grid;
  gap: 8px;
  padding: 17px;
  background: var(--panel-bg);
  border: 1px solid var(--line);
  border-radius: 11px;
}
.environment-facts span {
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 0.12em;
}
.environment-facts strong {
  font-size: 12px;
}
.environment-disclaimer {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.6;
}
.environment-invalid {
  display: grid;
  place-content: center;
  height: 100%;
  text-align: center;
  padding: 18px;
}
.environment-invalid p {
  color: var(--muted-strong);
  font-size: 12px;
}
@media (max-width: 1150px) {
  .environment-grid {
    grid-template-columns: 1fr;
  }
  .environment-module-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .environment-header {
    flex-direction: column;
    align-items: stretch;
  }
  .environment-stage {
    min-height: 430px;
  }
  .environment-editor {
    padding: 15px;
  }
  .environment-facts {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 430px) {
  .environment-module-list {
    grid-template-columns: 1fr;
  }
  .environment-stage {
    min-height: 370px;
  }
}
</style>
