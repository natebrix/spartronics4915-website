<script setup lang="ts">
import { DONATE_URL } from '~~/shared/consts';

definePageMeta({ fullWidth: true });
useSiteHead({
	title: 'Our Sponsors',
	description: 'The businesses, organizations and families who make Spartronics 4915 possible.',
});
</script>

<template>
	<div class="wrap">
		<p class="eyebrow">Thank you</p>
		<h1>Our Sponsors</h1>
		<p class="lead">
			Spartronics is grateful for all of our supporters. You help us spread STEAM education to students island-wide.
			If you are interested in becoming a sponsor or donating, we would love to hear from you.
		</p>
		<p class="actions">
			<a class="button" :href="DONATE_URL">Donate</a>
			<NuxtLink class="button secondary" to="/sponsors/sponsor-information/">Become a sponsor</NuxtLink>
		</p>
		<SponsorGrid />
	</div>
</template>

<style scoped>
	.wrap {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 1.5rem 1rem 0;
	}
	.lead {
		max-width: var(--column);
		font-size: 1.15rem;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 1.5rem 0 3rem;
	}
</style>
