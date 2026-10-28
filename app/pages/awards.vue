<script setup lang="ts">
// Every award the team has won, one file per season in content/awards/.
useSiteHead({ title: 'Awards', description: 'Every award Spartronics 4915 has won since our rookie season in 2014.' });

const { data: seasons } = await useAsyncData('awards', () => queryCollection('awards').order('year', 'DESC').all());
const total = computed(() => (seasons.value ?? []).reduce((sum, season) => sum + season.awards.length, 0));
</script>

<template>
	<p class="eyebrow">Since 2014</p>
	<h1>Awards</h1>
	<p class="lead">
		{{ total }} awards and honors in {{ seasons?.length }} seasons of competition. Meet the robots that won them in
		<NuxtLink to="/history/">Our History</NuxtLink>.
	</p>
	<section v-for="season in seasons" :key="season.year">
		<h2>
			{{ season.year }}
			<span v-if="season.note" class="note">{{ season.note }}</span>
		</h2>
		<ul>
			<li v-for="(award, i) in season.awards" :key="i">{{ award }}</li>
		</ul>
	</section>
</template>

<style scoped>
	.lead {
		font-size: 1.15rem;
	}
	section {
		display: grid;
		grid-template-columns: 6rem 1fr;
		gap: 1rem;
		padding: 1rem 0;
		border-top: 1px solid var(--line);
	}
	h2 {
		margin: 0;
		font-size: 1.4rem;
		color: var(--blue);
	}
	.note {
		display: block;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--muted);
	}
	ul {
		margin: 0;
		padding-left: 1.1rem;
	}
	@media (max-width: 480px) {
		section {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
