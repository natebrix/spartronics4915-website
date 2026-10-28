<script setup lang="ts">
// A simple page whose text is one .md file in content/pages/.
import type { PagesCollectionItem } from '@nuxt/content';

const props = defineProps<{ page: PagesCollectionItem }>();

useSiteHead({ title: props.page.title, description: props.page.description, noindex: props.page.noindex });
</script>

<template>
	<h1>{{ page.title }}</h1>
	<ContentRenderer :value="page" class="prose" />
</template>
