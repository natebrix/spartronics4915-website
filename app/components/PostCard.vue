<script setup lang="ts">
defineProps<{
	post: { path: string; title: string; date: string; summary: string; cover?: string };
}>();
</script>

<template>
	<article class="card">
		<NuxtLink :to="pageUrl(post.path)">
			<NuxtImg v-if="post.cover" :src="post.cover" alt="" width="640" height="360" fit="cover" format="webp" loading="lazy" class="cover" />
			<div class="body">
				<p class="date"><FormattedDate :date="post.date" /></p>
				<h3>{{ post.title }}</h3>
				<p class="summary">{{ post.summary }}</p>
			</div>
		</NuxtLink>
	</article>
</template>

<style scoped>
	.card {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--paper);
		transition: box-shadow 0.15s;
	}
	.card:hover {
		box-shadow: 0 6px 20px rgb(0 0 0 / 0.08);
	}
	a {
		color: inherit;
		text-decoration: none;
		display: block;
		height: 100%;
	}
	.cover {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		display: block;
	}
	.body {
		padding: 1rem 1.1rem 1.25rem;
	}
	.date {
		margin: 0;
		color: var(--muted);
		font-size: 0.9rem;
	}
	h3 {
		margin: 0.25rem 0 0.5rem;
		font-size: 1.15rem;
	}
	.summary {
		margin: 0;
		color: var(--muted);
		font-size: 0.95rem;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
