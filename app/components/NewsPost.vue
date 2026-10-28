<script setup lang="ts">
// The page for one news post. app/pages/[slug].vue picks this for posts.
import type { ContentNavigationItem, PostsCollectionItem } from '@nuxt/content';

const props = defineProps<{
	post: PostsCollectionItem;
	newer?: ContentNavigationItem | null;
	older?: ContentNavigationItem | null;
}>();

// Imported posts usually repeat the cover photo as their first image.
const showCover = props.post.cover && !props.post.wordpressId;

useSiteHead({ title: props.post.title, description: props.post.summary, image: props.post.cover });
</script>

<template>
	<article>
		<p class="eyebrow"><NuxtLink to="/news/">News</NuxtLink></p>
		<h1>{{ post.title }}</h1>
		<p class="meta">
			<FormattedDate :date="post.date" />
			<span v-if="post.author"> · {{ post.author }}</span>
		</p>
		<NuxtImg v-if="showCover" :src="post.cover" alt="" width="1200" format="webp" class="cover" />
		<ContentRenderer :value="post" class="prose" />
	</article>
	<nav class="pager" aria-label="More posts">
		<NuxtLink v-if="newer" :to="pageUrl(newer.path)">← {{ newer.title }}</NuxtLink>
		<span v-else />
		<NuxtLink v-if="older" :to="pageUrl(older.path)">{{ older.title }} →</NuxtLink>
	</nav>
</template>

<style scoped>
	.eyebrow a {
		text-decoration: none;
	}
	.meta {
		color: var(--muted);
		margin-top: -0.25rem;
	}
	.cover {
		width: 100%;
		border-radius: var(--radius);
		margin: 1rem 0;
	}
	.pager {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
		font-weight: 600;
	}
	.pager a {
		max-width: 48%;
		text-decoration: none;
	}
	.pager a:last-child {
		text-align: right;
	}
</style>
