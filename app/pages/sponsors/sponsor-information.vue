<script setup lang="ts">
import { DONATE_URL, TEAM_EMAIL } from '~~/shared/consts';
import { SPONSOR_TIERS } from '~~/shared/data/sponsorTiers';

definePageMeta({ fullWidth: true });
useSiteHead({ title: 'Support Us', description: 'Sponsorship levels and how to support Spartronics 4915.' });

const sponsorMailto = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent("I'm interested in becoming a Sponsor")}`;
</script>

<template>
	<div class="wrap">
		<section class="intro">
			<p class="eyebrow">Support us</p>
			<h1>We need funds for our season!</h1>
			<p class="lead">Help Spartronics spread the enthusiasm for STEAM education to future generations.</p>
			<p class="actions">
				<a class="button" :href="DONATE_URL">Donate</a>
				<a class="button secondary" :href="sponsorMailto">Email us about sponsoring</a>
			</p>
		</section>

		<section>
			<h2>Sponsorship levels</h2>
			<p class="note">
				Sponsorship logos must be received by <strong>October 31</strong> at
				<a :href="`mailto:${TEAM_EMAIL}`">{{ TEAM_EMAIL }}</a>. Thank you for your support!
			</p>
			<ul class="tiers">
				<li v-for="tier in SPONSOR_TIERS" :key="tier.id" class="tier" :class="`tier-${tier.id}`">
					<h3>{{ tier.name }}</h3>
					<p class="amount">{{ tier.amount }}</p>
					<ul>
						<li v-for="benefit in tier.benefits" :key="benefit">{{ benefit }}</li>
					</ul>
				</li>
			</ul>
		</section>

		<section class="info">
			<h2>Sponsorship information</h2>
			<p>
				Without the help of our sponsors and the support of our team’s parents and family, Spartronics Team 4915
				would not exist. During our six-week build season, we provide dinners, lunches, and snacks to more than 40
				student team members and 10 professional mentors.
			</p>
			<p>
				Our sponsors’ and families’ support allows us to outfit our students with team shirts and safety glasses,
				purchase equipment and materials to build our robots, pay for competition fees and registration, and reduce
				the travel costs for our team through our ongoing fundraising efforts.
			</p>
			<p>For more information, email us at <a :href="sponsorMailto">{{ TEAM_EMAIL }}</a>.</p>
			<p><NuxtLink to="/sponsors/">See our current sponsors →</NuxtLink></p>
		</section>
	</div>
</template>

<style scoped>
	.wrap {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 1.5rem 1rem 0;
	}
	.lead {
		font-size: 1.15rem;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin: 1.5rem 0 1rem;
	}
	.note {
		background: var(--tint);
		border-left: 4px solid var(--yellow);
		padding: 0.75rem 1rem;
		border-radius: 0 var(--radius) var(--radius) 0;
	}
	.tiers {
		list-style: none;
		margin: 1.5rem 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: 1rem;
	}
	.tier {
		border: 1px solid var(--line);
		border-top: 6px solid var(--blue);
		border-radius: var(--radius);
		padding: 1rem 1.2rem 1.2rem;
	}
	.tier-pantheon,
	.tier-platinum {
		border-top-color: var(--yellow);
		background: var(--tint);
	}
	.tier h3 {
		margin: 0;
	}
	.amount {
		margin: 0.15rem 0 0.75rem;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--blue);
	}
	.tier ul {
		margin: 0;
		padding-left: 1.2rem;
		font-size: 0.97rem;
	}
	.tier li + li {
		margin-top: 0.3rem;
	}
	.info {
		max-width: var(--column);
		margin-top: 2rem;
	}
</style>
