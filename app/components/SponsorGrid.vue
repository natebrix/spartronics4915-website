<script setup lang="ts">
// Sponsor logos grouped by tier, from content/sponsors/.
// Sponsors without a logo are listed by name.
import { SPONSOR_TIERS, type SponsorTierId } from '~~/shared/data/sponsorTiers';

const props = defineProps<{
	// Only show these tiers. Shows every tier when left out.
	tiers?: SponsorTierId[];
	// Smaller logos and no tier headings, for use on other pages.
	compact?: boolean;
}>();

const { data: sponsors } = await useSponsors();
const groups = computed(() =>
	SPONSOR_TIERS.filter((tier) => !props.tiers || props.tiers.includes(tier.id))
		.map((tier) => ({ tier, sponsors: (sponsors.value ?? []).filter((s) => s.tier === tier.id) }))
		.filter((group) => group.sponsors.length > 0),
);
</script>

<template>
	<div class="sponsor-grid" :class="{ compact }">
		<section v-for="{ tier, sponsors: members } in groups" :key="tier.id" class="tier" :class="`tier-${tier.id}`">
			<h2 v-if="!compact">{{ tier.name }}</h2>
			<ul class="logos">
				<li v-for="s in members.filter((s) => s.logo)" :key="s.name">
					<component :is="s.link ? 'a' : 'span'" :href="s.link" class="tile">
						<NuxtImg :src="s.logo" :alt="s.name" width="320" format="webp" loading="lazy" />
					</component>
				</li>
			</ul>
			<ul v-if="members.some((s) => !s.logo)" class="names">
				<li v-for="s in members.filter((s) => !s.logo)" :key="s.name">
					<a v-if="s.link" :href="s.link">{{ s.name }}</a>
					<template v-else>{{ s.name }}</template>
				</li>
			</ul>
		</section>
	</div>
</template>

<style scoped>
	.tier + .tier {
		margin-top: 2.5rem;
	}
	h2 {
		margin: 0 0 1rem;
		padding-bottom: 0.4rem;
		border-bottom: 3px solid var(--yellow);
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.logos {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		gap: 1rem;
	}
	.tier-pantheon .logos {
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
	}
	/* Sponsor logos are white, so each sits on a blue tile. */
	.tile {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 8rem;
		padding: 1.25rem;
		background: var(--blue);
		border-radius: var(--radius);
		transition: background 0.15s;
	}
	a.tile:hover {
		background: var(--blue-dark);
	}
	.tile img {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}
	.tier-pantheon .tile {
		height: 10rem;
	}
	.names {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 2rem;
		margin-top: 0.5rem;
		font-size: 1.15rem;
		font-weight: 600;
	}
	.logos:empty {
		display: none;
	}

	/* Two logos per row on phones. */
	@media (max-width: 600px) {
		.logos,
		.tier-pantheon .logos {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.6rem;
		}
		.tile,
		.tier-pantheon .tile {
			height: 5.5rem;
			padding: 0.8rem;
		}
	}

	.compact .logos {
		grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
		gap: 0.75rem;
	}
	.compact .tile,
	.compact .tier-pantheon .tile {
		height: 5.5rem;
		padding: 0.9rem;
	}
	.compact .tier + .tier {
		margin-top: 0.75rem;
	}
	.compact .names {
		font-size: 1rem;
	}
</style>
