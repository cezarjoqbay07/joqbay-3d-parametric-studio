<script setup lang="ts">
import { finishes, getPreset, presets } from '@/application/studioPresets'
import type {
  CabinetConfig,
  CabinetKind,
  FinishId,
  StructureMode,
  FrontMode,
} from '@/contracts/studio'

const props = defineProps<{ modelValue: CabinetConfig }>()
const emit = defineEmits<{ 'update:modelValue': [config: CabinetConfig] }>()
const structureOptions = [
  { value: 'sides-through', label: 'Laterais passantes' },
  { value: 'horizontal-through', label: 'Topo e base passantes' },
] as const
const dimensions = [
  { key: 'width', label: 'Largura', min: 300, max: 2400 },
  { key: 'height', label: 'Altura', min: 350, max: 2600 },
  { key: 'depth', label: 'Profundidade', min: 250, max: 900 },
  { key: 'thickness', label: 'Espessura', min: 12, max: 36 },
] as const
function update(field: keyof CabinetConfig, value: string | number) {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
function updateNumber(field: 'width' | 'height' | 'depth' | 'thickness', event: Event) {
  update(field, (event.target as HTMLInputElement).valueAsNumber)
}
function changeKind(event: Event) {
  emit('update:modelValue', getPreset((event.target as HTMLSelectElement).value as CabinetKind))
}
</script>
<template>
  <form class="config-panel" @submit.prevent>
    <div class="config-header">
      <div>
        <span class="eyebrow">YOUR SPECIFICATIONS</span>
        <h2>Configuração do módulo</h2>
      </div>
      <span class="config-step">01 / 02</span>
    </div>
    <div class="form-field">
      <label for="cabinet-kind">Tipo de módulo</label>
      <div class="select-wrap">
        <select id="cabinet-kind" :value="modelValue.kind" @change="changeKind">
          <option v-for="option in presets" :key="option.kind" :value="option.kind">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-field">
      <label for="cabinet-name">Nome da configuração</label
      ><input
        id="cabinet-name"
        type="text"
        autocomplete="off"
        maxlength="70"
        placeholder="Ex.: Balcão gourmet"
        :value="modelValue.name"
        @input="update('name', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="form-divider"><span>DIMENSÕES</span><small>mm</small></div>
    <div class="dimension-grid">
      <div v-for="dimension in dimensions" :key="dimension.key" class="form-field">
        <label :for="`dimension-${dimension.key}`">{{ dimension.label }}</label>
        <div class="unit-input">
          <input
            :id="`dimension-${dimension.key}`"
            type="number"
            :min="dimension.min"
            :max="dimension.max"
            step="1"
            inputmode="decimal"
            :value="modelValue[dimension.key]"
            @input="updateNumber(dimension.key, $event)"
          /><span>mm</span>
        </div>
        <small class="range-hint">{{ dimension.min }}–{{ dimension.max }} mm</small>
      </div>
    </div>
    <div class="form-divider"><span>ESTRUTURA</span><small>Montagem ilustrativa</small></div>
    <fieldset class="segmented-options" aria-label="Estrutura do módulo">
      <label v-for="option in structureOptions" :key="option.value">
        <input
          type="radio"
          name="structure"
          :value="option.value"
          :checked="modelValue.structure === option.value"
          @change="update('structure', option.value as StructureMode)"
        />
        <span>{{ option.label }}</span>
      </label>
    </fieldset>
    <div class="form-field">
      <label for="cabinet-front">Frente do módulo</label>
      <div class="select-wrap">
        <select
          id="cabinet-front"
          :value="modelValue.front"
          @change="update('front', ($event.target as HTMLSelectElement).value as FrontMode)"
        >
          <option value="open">Sem portas</option>
          <option value="doors">Duas portas</option>
          <option value="drawers">Três frentes de gaveta (conceito)</option>
        </select>
      </div>
      <small class="range-hint">Fundos com 6 mm nesta prévia. Sem ferragens ou usinagens.</small>
    </div>
    <div class="form-divider"><span>ACABAMENTO</span><small>4 opções</small></div>
    <div class="finish-options">
      <button
        v-for="(finish, id) in finishes"
        :key="id"
        type="button"
        class="finish-option"
        :class="{ chosen: modelValue.finish === id }"
        :aria-pressed="modelValue.finish === id"
        @click="update('finish', id as FinishId)"
      >
        <span class="finish-swatch" :style="{ background: finish.hex }" /><span>{{
          finish.label
        }}</span
        ><span v-if="modelValue.finish === id" class="finish-check">✓</span>
      </button>
    </div>
    <p class="form-note">
      Os parâmetros geram uma prévia geométrica local. Regras industriais e validações autoritativas
      serão responsabilidade da API futura.
    </p>
  </form>
</template>
<style scoped>
.config-panel {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.config-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  border-bottom: 1px solid var(--line);
  padding-bottom: 20px;
}
.config-header h2 {
  font-size: 18px;
  margin: 8px 0 0;
  letter-spacing: -0.03em;
}
.config-step {
  font-size: 11px;
  color: var(--muted);
}
.form-field {
  display: grid;
  gap: 9px;
  min-width: 0;
}
.form-field label {
  color: var(--muted-strong);
  font-size: 11px;
  font-weight: 650;
}
.form-field input,
.form-field select {
  width: 100%;
  outline: 0;
  font: inherit;
  font-size: 12px;
  color: var(--text);
  border: 1px solid var(--line-strong);
  background: var(--input-bg);
  border-radius: 9px;
  padding: 12px 13px;
  min-height: 44px;
}
.form-field input:focus,
.form-field select:focus {
  border-color: var(--mint);
}
.select-wrap select {
  cursor: pointer;
}
.select-wrap option {
  color: #151c22;
}
.form-divider {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid var(--line);
  padding-top: 20px;
  font-size: 10px;
  font-weight: 800;
  color: var(--muted-strong);
  letter-spacing: 0.11em;
}
.form-divider small {
  font-size: 10px;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0;
}
.dimension-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px 13px;
}
.unit-input {
  position: relative;
}
.unit-input input {
  padding-right: 37px;
  font-size: 14px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.unit-input span {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 10px;
  pointer-events: none;
}
.range-hint {
  color: var(--muted);
  font-size: 9px;
}
.finish-options {
  display: grid;
  gap: 8px;
}
.finish-option {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 9px;
  font: inherit;
  color: var(--muted-strong);
  background: var(--input-bg);
  text-align: left;
  font-size: 11px;
}
.finish-option.chosen {
  color: var(--text);
  border-color: var(--mint);
  background: var(--active-nav);
}
.finish-swatch {
  display: block;
  height: 19px;
  width: 19px;
  border-radius: 5px;
  border: 1px solid #ffffff20;
}
.finish-check {
  margin-left: auto;
  color: var(--mint);
}
.form-note {
  color: var(--muted);
  line-height: 1.6;
  font-size: 10px;
  margin: 0;
}
@media (max-width: 400px) {
  .dimension-grid {
    gap: 12px 8px;
  }
}
</style>

<style scoped>
.segmented-options {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  border: 0;
}
.segmented-options label {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 44px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  cursor: pointer;
  font-size: 11px;
  color: var(--muted-strong);
}
.segmented-options label:has(input:checked) {
  border-color: var(--mint);
  background: var(--active-nav);
  color: var(--text);
}
.segmented-options input {
  accent-color: var(--mint);
}
</style>
