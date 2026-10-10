<script setup lang="ts">
withDefaults(defineProps<{ name: string; size?: number }>(), { size: 19 })
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'home'">
      <path d="m3 10 9-7 9 7v10H3z" />
      <path d="M9 20v-7h6v7" />
    </template>
    <template v-else-if="name === 'cube'">
      <path d="m12 2 9 5v10l-9 5-9-5V7z" />
      <path d="m3 7 9 5 9-5M12 12v10" />
    </template>
    <template v-else-if="name === 'layers'">
      <path d="m12 2 9 5-9 5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </template>
    <template v-else-if="name === 'moon'">
      <path d="M20 15.4A8 8 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2m0 16v2M4.9 4.9l1.5 1.5m11.2 11.2 1.5 1.5M2 12h2m16 0h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"
      />
    </template>
    <template v-else-if="name === 'menu'"><path d="M4 6h16M4 12h16M4 18h16" /></template>
    <template v-else-if="name === 'close'"><path d="m5 5 14 14M19 5 5 19" /></template>
    <template v-else-if="name === 'arrow'"><path d="M5 12h14m-6-6 6 6-6 6" /></template>
    <template v-else-if="name === 'sliders'">
      <path d="M4 7h16M4 17h16" />
      <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="17" r="2" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'check'"><path d="m5 12 4 4L19 6" /></template>
    <template v-else-if="name === 'download'">
      <path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3" />
    </template>
    <template v-else-if="name === 'chevron'"><path d="m7 10 5 5 5-5" /></template>
    <template v-else-if="name === 'external'">
      <path d="M13 5h6v6m0-6-9 9M19 14v5H5V5h5" />
    </template>
    <template v-else-if="name === 'sparkles'">
      <path
        d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7zM19 18l.5 1.5L21 20l-1.5.5L19 22l-.5-1.5L17 20l1.5-.5z"
      />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="m12 2 9 4v6c0 6-5 9-9 10-4-1-9-4-9-10V6z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </template>
    <template v-else-if="name === 'github'">
      <path
        d="M9 19c-4 1-4-2-6-2m12 4v-3c0-1 .3-1.5 1-2 3.5-.5 5-2 5-6a6 6 0 0 0-2-4c0-1 0-2-1-3-2 0-3 1-4 1h-4C9 4 8 3 6 3 5 4 5 5 5 6a6 6 0 0 0-2 4c0 4 1.5 5.5 5 6 .7.5 1 1 1 2v3"
      />
    </template>
  </svg>
</template>
