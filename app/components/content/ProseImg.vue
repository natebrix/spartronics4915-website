<script setup lang="ts">
// Photos in posts and pages. Photos from public/ are resized and saved as
// WebP when the site builds; they're never made bigger than the original.
const props = defineProps<{ src: string; alt?: string; width?: string | number; height?: string | number }>();

const img = useImage();
const src = computed(() => (props.src.startsWith('/') ? img(props.src, { width: 1600, format: 'webp' }) : props.src));
</script>

<template>
	<img :src="src" :alt="alt ?? ''" :width="width" :height="height" loading="lazy" decoding="async" />
</template>
