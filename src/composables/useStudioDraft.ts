import { ref, watch } from 'vue'
import { createLocalCabinetPreview } from '@/application/localPreviewAdapter'
import { getPreset } from '@/application/studioPresets'
import type {
  CabinetConfig,
  CabinetKind,
  FinishId,
  FrontMode,
  StructureMode,
} from '@/contracts/studio'

const STORAGE_KEY = 'joqbay-studio-draft-v2'
function isCabinetKind(value: unknown): value is CabinetKind {
  return value === 'counter' || value === 'wall' || value === 'tower'
}
function isFinish(value: unknown): value is FinishId {
  return value === 'graphite' || value === 'oak' || value === 'linen' || value === 'white'
}

function isStructure(value: unknown): value is StructureMode {
  return value === 'sides-through' || value === 'horizontal-through'
}
function isFront(value: unknown): value is FrontMode {
  return value === 'open' || value === 'doors' || value === 'drawers'
}
function loadDraft(): CabinetConfig {
  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('joqbay-studio-draft-v1') ?? 'null',
    ) as Record<string, unknown> | null
    const kind = stored?.kind === 'base' ? 'counter' : stored?.kind
    if (
      !stored ||
      !isCabinetKind(kind) ||
      !isFinish(stored.finish) ||
      typeof stored.name !== 'string'
    )
      return getPreset('counter')
    const config: CabinetConfig = {
      kind,
      name: stored.name,
      finish: stored.finish,
      width: Number(stored.width),
      height: Number(stored.height),
      depth: Number(stored.depth),
      thickness: Number(stored.thickness),
      structure: isStructure(stored.structure) ? stored.structure : 'sides-through',
      front: isFront(stored.front) ? stored.front : 'open',
    }
    if (!createLocalCabinetPreview(config).ok) return getPreset('counter')
    return config
  } catch {
    return getPreset('counter')
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
