<script setup lang="ts">
import type { AppView } from '@/contracts/studio'
import type { ColorTheme } from '@/composables/useTheme'
import UiIcon from './UiIcon.vue'

defineProps<{ view: AppView; theme: ColorTheme }>()
const emit = defineEmits<{ menu: []; themeToggle: []; navigate: [view: AppView] }>()
const labels: Record<AppView, string> = {
  home: 'Visão geral',
  studio: 'Configurador 3D',
  environment: 'Ambiente cozinha',
  templates: 'Biblioteca de modelos',
  about: 'Sobre o projeto',
}
</script>
<template>
  <header class="app-header">
    <div class="breadcrumbs">
      <button
        type="button"
        class="mobile-menu icon-button"
        aria-label="Abrir menu"
        @click="emit('menu')"
      >
        <UiIcon name="menu" /></button
      ><span>Workspace</span><span class="crumb-divider">/</span><strong>{{ labels[view] }}</strong>
    </div>
    <div class="header-actions">
      <span class="demo-status"><span class="status-dot" /> DEMO INTERATIVA</span
      ><button
        type="button"
        class="theme-switch"
        :aria-label="theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'"
        @click="emit('themeToggle')"
      >
        <UiIcon :name="theme === 'dark' ? 'sun' : 'moon'" :size="17" /><span>{{
          theme === 'dark' ? 'Claro' : 'Escuro'
        }}</span></button
      ><button type="button" class="header-cta" @click="emit('navigate', 'studio')">
        Abrir studio <UiIcon name="arrow" :size="15" />
      </button>
    </div>
  </header>
</template>
<style scoped>
.app-header {
  height: 82px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 0 37px;
  background: var(--main-bg);
}
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  color: var(--muted);
  font-size: 12px;
}
.breadcrumbs strong {
  color: var(--text);
  font-weight: 650;
}
.crumb-divider {
  color: var(--muted);
  opacity: 0.5;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 13px;
}
.demo-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-strong);
  white-space: nowrap;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.09em;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--mint);
}
.theme-switch {
  cursor: pointer;
  border: 1px solid var(--line);
  background: var(--panel-bg);
  color: var(--text);
  border-radius: 8px;
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
}
.theme-switch:hover {
  border-color: var(--mint);
}
.header-cta {
  background: var(--mint);
  color: #0d2422;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  padding: 12px 14px;
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.mobile-menu {
  display: none;
  margin-right: 6px;
}
@media (max-width: 1100px) {
  .demo-status {
    display: none;
  }
}
@media (max-width: 940px) {
  .mobile-menu {
    display: grid;
  }
}
@media (max-width: 650px) {
  .app-header {
    height: 64px;
    padding: 0 16px;
  }
  .breadcrumbs {
    gap: 6px;
    font-size: 10px;
  }
  .header-actions {
    gap: 7px;
  }
  .theme-switch {
    padding: 10px;
  }
  .theme-switch span {
    display: none;
  }
  .header-cta {
    display: none;
  }
}
</style>
