<script setup lang="ts">
// Text for this page is in content/pages/join.md; subteams are in
// content/subteams/.
import { TEAM_EMAIL } from '~~/shared/consts';

definePageMeta({ fullWidth: true });

const { data: page } = await useAsyncData('page-join', () => queryCollection('pages').path('/join').first());
if (!page.value) throw createError({ statusCode: 500, statusMessage: 'Missing content/pages/join.md', fatal: true });

const teamPhoto = '/images/home/team.jpg';
useSiteHead({ title: page.value.title, description: page.value.description, image: teamPhoto });
const season = useSeason();
</script>

<template>
	<section class="hero">
		<div class="text">
			<p class="eyebrow">Join us</p>
			<h1>{{ page!.title }}</h1>
			<p class="lead">
				High school students: come learn engineering, electronics, design, programming, or business and marketing in
				our {{ season.label }} season. No experience needed. Stop by any meeting!
			</p>
			<p class="actions">
				<NuxtLink class="button" to="/calendar/">See meeting dates</NuxtLink>
				<a class="button secondary" :href="`mailto:${TEAM_EMAIL}`">Email us</a>
			</p>
		</div>
		<NuxtImg :src="teamPhoto" alt="Spartronics programmers working on robot code" width="900" format="webp" class="photo" />
	</section>

	<div class="wrap">
		<h2>Our subteams</h2>
		<SubteamCards />
		<ContentRenderer :value="page!" class="prose" />
	</div>
</template>

<style scoped>
	.hero {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 2rem 1rem 1rem;
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 2rem;
		align-items: center;
	}
	.lead {
		font-size: 1.15rem;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.photo {
		width: 100%;
		border-radius: var(--radius);
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}
	.wrap {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 0 1rem;
	}
	.prose {
		max-width: var(--column);
		margin-top: 1rem;
	}
	@media (max-width: 760px) {
		.hero {
			grid-template-columns: 1fr;
			padding-top: 1rem;
		}
		.photo {
			order: -1;
		}
	}
</style>
