<script setup lang="ts">
import type { AppView } from '@/contracts/studio'
import UiIcon from './UiIcon.vue'

defineProps<{ active: AppView; open: boolean }>()
const emit = defineEmits<{ navigate: [view: AppView]; close: [] }>()
const navigation: Array<{ id: AppView; label: string; icon: string; hint?: string }> = [
  { id: 'home', label: 'Visão geral', icon: 'home' },
  { id: 'studio', label: 'Configurador 3D', icon: 'cube', hint: 'LIVE' },
  { id: 'environment', label: 'Ambiente cozinha', icon: 'layers', hint: 'NEW' },
  { id: 'templates', label: 'Modelos', icon: 'layers' },
  { id: 'about', label: 'Sobre o projeto', icon: 'info' },
]
function navigate(view: AppView) {
  emit('navigate', view)
  emit('close')
}
</script>
<template>
  <div v-if="open" class="sidebar-scrim" @click="emit('close')" />
  <aside class="sidebar" :class="{ 'sidebar-open': open }" aria-label="Navegação principal">
    <div class="brand-row">
      <div class="brand-mark" aria-hidden="true">J<span>Q</span></div>
      <div class="brand-title">
        <strong>JOQBAY<span> / 3D</span></strong
        ><small>PARAMETRIC STUDIO</small>
      </div>
      <button
        type="button"
        class="mobile-close icon-button"
        aria-label="Fechar menu"
        @click="emit('close')"
      >
        <UiIcon name="close" />
      </button>
    </div>
    <div class="sidebar-divider" />
    <p class="nav-caption">WORKSPACE</p>
    <nav class="nav-links">
      <button
        v-for="item in navigation"
        :key="item.id"
        type="button"
        class="nav-link"
        :class="{ active: active === item.id }"
        :aria-current="active === item.id ? 'page' : undefined"
        @click="navigate(item.id)"
      >
        <UiIcon :name="item.icon" :size="18" />
        <span>{{ item.label }}</span>
        <small v-if="item.hint" class="nav-pill">{{ item.hint }}</small>
      </button>
    </nav>
    <div class="sidebar-spacer" />
    <div class="roadmap-card">
      <span class="roadmap-eyebrow"><UiIcon name="sparkles" :size="15" /> EM EVOLUÇÃO</span>
      <strong>Do conceito à engenharia.</strong>
      <p>Uma demonstração interativa do que é possível construir com tecnologia web.</p>
      <button type="button" class="roadmap-link" @click="navigate('about')">
        Conheça a arquitetura <UiIcon name="arrow" :size="15" />
      </button>
    </div>
    <div class="sidebar-bottom">
      <span class="status-point" /> Portfolio demo <span class="sidebar-version">v0.2.0</span>
    </div>
  </aside>
</template>
<style scoped>
.sidebar {
  width: 252px;
  flex-shrink: 0;
  min-height: 100vh;
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 28px 15px 18px;
  border-right: 1px solid var(--line);
  background: var(--sidebar-bg);
  z-index: 30;
}
.brand-row {
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 11px;
  min-height: 45px;
}
.brand-mark {
  height: 38px;
  width: 38px;
  border: 1px solid var(--mint);
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: -0.09em;
  background: var(--mint-halo);
  color: var(--mint);
}
.brand-mark span {
  color: var(--text);
}
.brand-title {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.brand-title strong {
  white-space: nowrap;
  font-size: 13px;
  letter-spacing: 0.075em;
}
.brand-title strong span {
  font-weight: 400;
  color: var(--mint);
}
.brand-title small {
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 0.14em;
}
.sidebar-divider {
  height: 1px;
  background: var(--line);
  margin: 29px 12px 26px;
}
.nav-caption {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.17em;
  margin: 0 12px 15px;
  color: var(--muted);
}
.nav-links {
  display: grid;
  gap: 5px;
}
.nav-link {
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--muted-strong);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  padding: 14px 12px;
  display: flex;
  align-items: center;
  gap: 13px;
  cursor: pointer;
}
.nav-link:hover {
  background: var(--hover);
  color: var(--text);
}
.nav-link.active {
  background: var(--active-nav);
  border-color: var(--active-border);
  color: var(--mint);
}
.nav-link span {
  flex: 1;
}
.nav-pill {
  padding: 3px 5px;
  color: var(--mint);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: var(--mint-halo);
  border-radius: 3px;
}
.sidebar-spacer {
  flex: 1;
  min-height: 22px;
}
.roadmap-card {
  background: var(--card-elevated);
  border: 1px solid var(--line);
  border-radius: 13px;
  padding: 18px 15px;
  display: grid;
  gap: 10px;
}
.roadmap-eyebrow {
  color: var(--mint);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
  display: flex;
  align-items: center;
  gap: 7px;
}
.roadmap-card strong {
  font-size: 13px;
  line-height: 1.3;
}
.roadmap-card p {
  color: var(--muted);
  line-height: 1.65;
  font-size: 11px;
  margin: 0;
}
.roadmap-link {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 0;
  color: var(--mint);
  border: 0;
  cursor: pointer;
  background: none;
  font: inherit;
  font-size: 11px;
  font-weight: 700;
  text-align: left;
}
.sidebar-bottom {
  border-top: 1px solid var(--line);
  margin: 19px 6px 0;
  padding: 17px 4px 0;
  color: var(--muted);
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-point {
  height: 6px;
  width: 6px;
  background: #51cba7;
  border-radius: 50%;
}
.sidebar-version {
  margin-left: auto;
}
.mobile-close,
.sidebar-scrim {
  display: none;
}
@media (max-width: 940px) {
  .sidebar {
    position: fixed;
    transform: translateX(-110%);
    transition: transform 0.23s ease;
    box-shadow: 24px 0 60px #0002;
  }
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
  .sidebar-scrim {
    display: block;
    position: fixed;
    inset: 0;
    background: #050c10ae;
    z-index: 29;
  }
  .mobile-close {
    display: grid;
    margin-left: auto;
  }
}
</style>
