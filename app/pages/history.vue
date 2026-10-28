<script setup lang="ts">
// Our History: a robot-by-season timeline, then the team's story season by season.
// The story is content/pages/history.md; the robots are shared/data/robots.ts.
import { ROBOTS } from '~~/shared/data/robots';

definePageMeta({ fullWidth: true });

const { data: page } = await useAsyncData('page-history', () => queryCollection('pages').path('/history').first());
if (!page.value) throw createError({ statusCode: 500, statusMessage: 'Missing content/pages/history.md', fatal: true });

useSiteHead({ title: page.value.title, description: page.value.description });

// Link each robot to the history.md section whose heading starts with its year.
const seasons = page.value.body.toc?.links ?? [];
const robots = ROBOTS.map((robot) => {
	const prefix = robot.section ?? String(robot.year);
	const heading = seasons.find((h) => h.text.startsWith(prefix));
	return { ...robot, href: heading ? `#${heading.id}` : undefined };
});
</script>

<template>
	<div class="wrap">
		<p class="eyebrow">Since 2013</p>
		<h1>{{ page!.title }}</h1>
		<p class="news-link">For what we’re up to this season, see our <NuxtLink to="/news/">latest news →</NuxtLink></p>
		<TimelineRobots :robots="robots" />
	</div>
	<ContentRenderer :value="page!" class="story prose" />
</template>

<style scoped>
	.wrap {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 1.5rem 1rem 0;
	}
	.news-link {
		margin-top: -0.5rem;
	}
	/* The story reads as a vertical timeline: a line down the left, a marker per season. */
	.story {
		max-width: calc(var(--column) + 2rem);
		margin: 0 auto;
		padding: 0 1rem 0 2.25rem;
		position: relative;
	}
	.story::before {
		content: '';
		position: absolute;
		left: 1rem;
		top: 0.5rem;
		bottom: 0;
		width: 4px;
		border-radius: 2px;
		background: var(--line);
	}
	.story :deep(h2) {
		position: relative;
		scroll-margin-top: 5.5rem;
		color: var(--blue);
	}
	.story :deep(h2:first-of-type) {
		margin-top: 0.5rem;
	}
	.story :deep(h2)::before {
		content: '';
		position: absolute;
		left: -1.6rem;
		top: 0.35em;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--yellow);
		border: 3px solid var(--blue);
	}
	.story :deep(img) {
		max-height: 34rem;
		width: auto;
	}
</style>
