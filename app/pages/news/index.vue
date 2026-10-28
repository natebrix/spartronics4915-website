<script setup lang="ts">
definePageMeta({ fullWidth: true });
useSiteHead({ title: 'News', description: 'Updates, competition recaps and newsletters from Spartronics 4915.' });

const { data: posts } = await usePosts();
const yearOf = (date: string) => new Date(date).getUTCFullYear();
const years = computed(() => [...new Set((posts.value ?? []).map((post) => yearOf(post.date)))]);
</script>

<template>
	<div class="wrap">
		<h1>News</h1>
		<nav class="years" aria-label="Jump to year">
			<a v-for="year in years" :key="year" :href="`#y${year}`">{{ year }}</a>
		</nav>
		<section v-for="year in years" :id="`y${year}`" :key="year">
			<h2>{{ year }}</h2>
			<div class="grid">
				<PostCard v-for="post in posts!.filter((p) => yearOf(p.date) === year)" :key="post.path" :post="post" />
			</div>
		</section>
	</div>
</template>

<style scoped>
	.wrap {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 1.5rem 1rem 0;
	}
	.years {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.years a {
		padding: 0.2rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		text-decoration: none;
		font-size: 0.95rem;
	}
	section {
		scroll-margin-top: 5rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1.25rem;
	}
</style>
