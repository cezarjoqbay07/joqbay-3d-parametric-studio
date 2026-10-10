import { ref, watch } from 'vue'

export type ColorTheme = 'dark' | 'light'
const STORAGE_KEY = 'joqbay-studio-theme'

function readSavedTheme(): ColorTheme {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/** Tema é preferência de interface, não regra de negócio. */
export function useTheme() {
  const theme = ref<ColorTheme>(readSavedTheme())
  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value
      try {
        window.localStorage.setItem(STORAGE_KEY, value)
      } catch {
        /* Armazenamento opcional. */
      }
    },
    { immediate: true },
  )
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
