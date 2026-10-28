<script setup lang="ts">
// The frame every page sits in. Pages that lay out their own full-width
// sections (like the home page) set `definePageMeta({ fullWidth: true })` and
// skip the default centered column.
const route = useRoute();
</script>

<template>
	<a class="skip-link" href="#main">Skip to content</a>
	<SiteHeader />
	<main id="main" :class="route.meta.fullWidth ? undefined : 'column'">
		<slot />
	</main>
	<SiteFooter />
</template>
