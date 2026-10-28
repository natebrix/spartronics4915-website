<script setup lang="ts">
// Everything served at /<name>/ that isn't its own file in app/pages/:
// - news posts, from content/posts/ (the same URLs the WordPress site used)
// - simple pages, from content/pages/. Adding a .md file there adds a page; no
//   code needed. A page with its own file here (like join.vue) uses that file
//   instead, which reads the Markdown text itself.
import { withoutTrailingSlash } from 'ufo';

const route = useRoute();
const path = withoutTrailingSlash(route.path);

const { data } = await useAsyncData(`content-${path}`, async () => {
	const post = await queryCollection('posts').path(path).first();
	if (post) {
		const [newer, older] = await queryCollectionItemSurroundings('posts', path).order('date', 'DESC').order('stem', 'ASC');
		return { kind: 'post' as const, post, newer, older };
	}
	const page = await queryCollection('pages').path(path).first();
	return page ? { kind: 'page' as const, page } : null;
});

if (!data.value) {
	throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}
</script>

<template>
	<NewsPost v-if="data?.kind === 'post'" :post="data.post" :newer="data.newer" :older="data.older" />
	<MarkdownPage v-else-if="data?.kind === 'page'" :page="data.page" />
</template>
