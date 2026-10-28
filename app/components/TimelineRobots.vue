<script setup lang="ts">
// A scrollable strip of robot cards, one per season, each linking to that
// season's section further down the page.
import type { Robot } from '~~/shared/data/robots';

defineProps<{
	robots: (Robot & { href?: string })[];
}>();
</script>

<template>
	<section class="timeline" aria-label="Spartronics robots by season">
		<ol>
			<li v-for="robot in robots" :key="robot.year">
				<NuxtImg
					v-if="robot.image"
					:src="robot.image"
					alt=""
					width="320"
					height="240"
					fit="cover"
					format="webp"
					loading="lazy"
					class="photo"
				/>
				<div v-else class="photo placeholder" aria-hidden="true">{{ robot.name }}</div>
				<span class="year">{{ robot.year }}</span>
				<!-- This link covers the whole card; the game link sits above it. -->
				<a class="name" :href="robot.href ?? '#'">{{ robot.name }}</a>
				<span v-if="robot.standsFor" class="stands-for">{{ robot.standsFor }}</span>
				<a class="game" :href="robot.game.url" :title="`Watch FIRST's ${robot.game.name} game video`">
					{{ robot.game.name }} ↗
				</a>
			</li>
		</ol>
	</section>
</template>

<style scoped>
	.timeline {
		margin: 1.5rem 0 2.5rem;
	}
	ol {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: minmax(11rem, 13rem);
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0 0 1rem;
		overflow-x: auto;
		scroll-snap-type: x proximity;
	}
	li {
		scroll-snap-align: start;
		position: relative;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--paper);
		transition: box-shadow 0.15s, transform 0.15s;
	}
	li:hover,
	li:focus-within {
		box-shadow: 0 6px 20px rgb(0 0 0 / 0.1);
		transform: translateY(-2px);
	}
	a {
		color: inherit;
		text-decoration: none;
	}
	/* Stretch the robot's link over the whole card. */
	.name::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.photo {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
	}
	.placeholder {
		display: grid;
		place-items: center;
		background: var(--blue);
		color: var(--yellow);
		font-family: var(--font-logo);
		font-weight: 400;
		font-size: 2rem;
		letter-spacing: 0.05em;
	}
	.year {
		align-self: flex-start;
		margin: -0.9rem 0 0 0.9rem;
		padding: 0.1rem 0.6rem;
		border-radius: 999px;
		background: var(--yellow);
		color: var(--ink);
		font-weight: 700;
		font-size: 0.9rem;
		position: relative;
	}
	.name {
		margin: 0.4rem 0.9rem 0;
		font-weight: 800;
		font-size: 1.2rem;
		color: var(--blue);
	}
	.stands-for {
		margin: 0.15rem 0.9rem 0;
		font-size: 0.85rem;
		line-height: 1.35;
		color: var(--text);
	}
	.game {
		/* Above the stretched card link, so it can be clicked on its own. */
		position: relative;
		z-index: 1;
		align-self: flex-start;
		margin: auto 0.9rem 0.8rem;
		padding-top: 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--blue);
	}
	.game:hover {
		text-decoration: underline;
	}
</style>
