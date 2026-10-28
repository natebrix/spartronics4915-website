<script setup lang="ts">
// Shown for a page that doesn't exist (and any other error). The build saves
// it as 404.html, which the host serves for unknown URLs.
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);

useSiteHead(
	notFound.value
		? { title: 'Page not found', description: "We couldn't find that page." }
		: { title: 'Something went wrong', description: 'Something went wrong loading this page.' },
);
</script>

<template>
	<NuxtLayout>
		<NotFound v-if="notFound" />
		<section v-else class="error">
			<h1>Something went wrong</h1>
			<p>{{ error.message }}</p>
			<p><NuxtLink class="button" to="/">Home</NuxtLink></p>
		</section>
	</NuxtLayout>
</template>
