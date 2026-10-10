<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { CabinetPreview } from '@/contracts/studio'
import { createCabinetRenderer } from '@/three/cabinetRenderer'

const props = defineProps<{ model: CabinetPreview; color: string; selectedId: string | null }>()
const emit = defineEmits<{ select: [id: string | null] }>()
const container = ref<HTMLDivElement | null>(null)
const renderer = ref<ReturnType<typeof createCabinetRenderer> | null>(null)
const errorMessage = ref('')

onMounted(() => {
  if (!container.value) return
  try {
    renderer.value = createCabinetRenderer(container.value, (id) => emit('select', id))
    renderer.value.updatePreview(props.model, props.color, props.selectedId)
    renderer.value.frameModel()
  } catch {
    errorMessage.value = 'A visualização 3D precisa de um navegador com WebGL habilitado.'
  }
})
watch(
  () => [props.model, props.color] as const,
  () => {
    renderer.value?.updatePreview(props.model, props.color, props.selectedId)
  },
)
watch(
  () => props.selectedId,
  (id) => renderer.value?.updateSelection(id),
)
onUnmounted(() => renderer.value?.dispose())

function downloadImage() {
  if (!renderer.value) return
  const anchor = document.createElement('a')
  anchor.href = renderer.value.capturePng()
  anchor.download = 'parametric-studio-preview.png'
  anchor.click()
}
</script>

<template>
  <div class="viewport-root">
    <div class="viewport-toolbar">
      <span class="live-label"><span class="live-dot" /> LIVE 3D PREVIEW</span>
      <div class="viewport-actions">
        <button
          type="button"
          class="viewport-button"
          title="Centralizar câmera"
          @click="renderer?.frameModel()"
        >
          Centralizar
        </button>
        <button
          type="button"
          class="viewport-button"
          title="Salvar imagem PNG"
          @click="downloadImage"
        >
          Exportar PNG ↗
        </button>
      </div>
    </div>
    <div ref="container" class="viewport-canvas" data-testid="cabinet-viewport" />
    <div v-if="errorMessage" class="viewport-error" role="alert">{{ errorMessage }}</div>
    <div class="viewport-bottom">
      <span>Arraste para girar · Scroll para zoom · Clique para selecionar</span
      ><span>MODELO CONCEITUAL</span>
    </div>
  </div>
</template>

<style scoped>
.viewport-root {
  height: 100%;
  min-height: 360px;
  position: relative;
  background:
    radial-gradient(ellipse at 55% 28%, var(--viewport-glow), transparent 58%), var(--viewport-bg);
  border-radius: 22px;
  overflow: hidden;
}
.viewport-canvas {
  width: 100%;
  height: 100%;
  min-height: 360px;
}
.viewport-toolbar {
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.viewport-toolbar > * {
  pointer-events: auto;
}
.live-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  padding: 9px 12px;
  border-radius: 9px;
  background: var(--floating-bg);
  border: 1px solid var(--line);
  color: var(--muted-strong);
}
.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mint);
  box-shadow: 0 0 0 3px var(--mint-halo);
}
.viewport-actions {
  display: flex;
  gap: 7px;
}
.viewport-button {
  color: var(--text);
  background: var(--floating-bg);
  border: 1px solid var(--line);
  padding: 9px 12px;
  border-radius: 9px;
  font-size: 11px;
  cursor: pointer;
}
.viewport-button:hover {
  border-color: var(--mint);
}
.viewport-bottom {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  pointer-events: none;
  color: var(--muted-strong);
  font-size: 10px;
  letter-spacing: 0.06em;
}
.viewport-error {
  position: absolute;
  inset: 24%;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 24px;
  color: var(--text);
  background: var(--floating-bg);
  border-radius: 12px;
}
@media (max-width: 650px) {
  .viewport-toolbar {
    top: 10px;
    left: 10px;
    right: 10px;
  }
  .viewport-button {
    padding: 8px;
    font-size: 10px;
  }
  .viewport-bottom span:last-child {
    display: none;
  }
  .viewport-bottom {
    bottom: 10px;
    left: 10px;
    font-size: 9px;
  }
}
</style>
