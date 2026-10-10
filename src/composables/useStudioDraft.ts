import { ref, watch } from 'vue'
import { createLocalCabinetPreview } from '@/application/localPreviewAdapter'
import { getPreset } from '@/application/studioPresets'
import type { CabinetConfig, CabinetKind, FinishId } from '@/contracts/studio'

const STORAGE_KEY = 'joqbay-studio-draft-v1'
function isCabinetKind(value: unknown): value is CabinetKind {
  return value === 'base' || value === 'wall' || value === 'tower'
}
function isFinish(value: unknown): value is FinishId {
  return value === 'graphite' || value === 'oak' || value === 'linen'
}

function loadDraft(): CabinetConfig {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Record<
      string,
      unknown
    > | null
    if (
      !stored ||
      !isCabinetKind(stored.kind) ||
      !isFinish(stored.finish) ||
      typeof stored.name !== 'string'
    )
      return getPreset('base')
    const config: CabinetConfig = {
      kind: stored.kind,
      name: stored.name,
      finish: stored.finish,
      width: Number(stored.width),
      height: Number(stored.height),
      depth: Number(stored.depth),
      thickness: Number(stored.thickness),
    }
    if (!createLocalCabinetPreview(config).ok) return getPreset('base')
    return config
  } catch {
    return getPreset('base')
  }
}
/** Persistência leve de rascunho na máquina do visitante; não há conta ou servidor. */
export function useStudioDraft() {
  const config = ref<CabinetConfig>(loadDraft())
  watch(
    config,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        /* Navegador pode bloquear armazenamento. */
      }
    },
    { deep: true },
  )
  return { config }
}
