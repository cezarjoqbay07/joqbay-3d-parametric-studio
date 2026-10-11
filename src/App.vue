<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { AppView, CabinetConfig, CabinetKind } from '@/contracts/studio'
import { getPreset } from '@/application/studioPresets'
import { useTheme } from '@/composables/useTheme'
import { useStudioDraft } from '@/composables/useStudioDraft'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import HomeView from '@/views/HomeView.vue'
import StudioView from '@/views/StudioView.vue'
import TemplatesView from '@/views/TemplatesView.vue'
import AboutView from '@/views/AboutView.vue'
import EnvironmentView from '@/views/EnvironmentView.vue'

const allowedViews: AppView[] = ['home', 'studio', 'environment', 'templates', 'about']
function readLocation(): AppView {
  const name = window.location.hash.slice(1) as AppView
  return allowedViews.includes(name) ? name : 'home'
}
const view = ref<AppView>(readLocation())
const mobileMenuOpen = ref(false)
const { theme, toggleTheme } = useTheme()
const { config } = useStudioDraft()
function navigate(destination: AppView) {
  view.value = destination
  mobileMenuOpen.value = false
  if (window.location.hash !== `#${destination}`) window.location.hash = destination
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function openPreset(kind: CabinetKind) {
  config.value = getPreset(kind)
  navigate('studio')
}
function updateConfig(updated: CabinetConfig) {
  config.value = updated
}
function onHashChange() {
  view.value = readLocation()
  mobileMenuOpen.value = false
}
onMounted(() => window.addEventListener('hashchange', onHashChange))
onUnmounted(() => window.removeEventListener('hashchange', onHashChange))
</script>
<template>
  <div class="application-shell">
    <AppSidebar
      :active="view"
      :open="mobileMenuOpen"
      @navigate="navigate"
      @close="mobileMenuOpen = false"
    />
    <div class="main-column">
      <AppHeader
        :view="view"
        :theme="theme"
        @menu="mobileMenuOpen = true"
        @theme-toggle="toggleTheme"
        @navigate="navigate"
      />
      <main id="main-content" class="main-content">
        <HomeView
          v-if="view === 'home'"
          @start="navigate('studio')"
          @preset="openPreset"
          @navigate="navigate"
        />
        <StudioView
          v-else-if="view === 'studio'"
          :model-value="config"
          @update:model-value="updateConfig"
        />
        <EnvironmentView v-else-if="view === 'environment'" />
        <TemplatesView v-else-if="view === 'templates'" @preset="openPreset" />
        <AboutView v-else />
      </main>
      <footer class="app-footer">
        <span>© 2026 JOQBAY · Parametric Studio 3D</span
        ><span>Projeto de portfólio independente · Não indicado para fabricação</span>
      </footer>
    </div>
  </div>
</template>
