<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_TITLE, TEAM_EMAIL } from '~~/shared/consts';

definePageMeta({ fullWidth: true });
useSiteHead({ title: SITE_TITLE, description: SITE_DESCRIPTION });

const { data: latest } = await usePosts(3);
const season = useSeason();

// Only the top two tiers appear on the home page; the rest are on /sponsors/.
const HOME_TIERS = ['pantheon', 'presenting'];
const { data: sponsors } = await useSponsors();
const featuredSponsors = computed(() =>
	(sponsors.value ?? []).filter((sponsor) => HOME_TIERS.includes(sponsor.tier) && sponsor.logo),
);
</script>

<template>
	<section class="hero">
		<div class="hero-inner">
			<NuxtImg src="/images/brand/logo.png" alt="Spartronics 4915 logo" width="260" height="260" format="webp" class="hero-logo" />
			<div>
				<p class="eyebrow light">FRC Team 4915, Bainbridge Island WA</p>
				<h1>We are Spartronics<br /><span>Team 4915</span></h1>
				<p class="lead">Builders, coders, electricians, designers and marketers from Bainbridge Island, Washington.</p>
				<p class="actions">
					<NuxtLink class="button" to="/join/">Join the team</NuxtLink>
					<NuxtLink class="button outline" to="/sponsors/sponsor-information/">Support us</NuxtLink>
				</p>
			</div>
		</div>
	</section>

	<EventCountdown />

	<section class="band">
		<div class="split">
			<div>
				<p class="eyebrow">Meet FRC Team 4915</p>
				<h2>Spartronics</h2>
				<p>
					Team 4915 proudly hails from Bainbridge Island, Washington. We were founded in 2013 by physics teacher Enrique
					Chee, and the team started its journey from scratch.
				</p>
				<p>
					Spartronics is an FRC team. <a href="https://www.firstinspires.org/robotics/frc">FRC</a>, short for FIRST
					Robotics Competition, is a program run by <a href="https://www.firstinspires.org/about">FIRST</a> that
					challenges teams of high school students to build an original robot to compete in a new themed game each year.
				</p>
				<p>
					We are now in our {{ ordinal(season.number) }} season, continuously working toward our mission: spreading
					STEM education in our local community and beyond, while encouraging equal gender representation in STEM
					fields.
				</p>
				<p>
					<strong>We are builders, we are coders, we are electricians, we are designers, we are marketers, we are Spartronics!</strong>
				</p>
			</div>
			<div class="photo video">
				<LoopVideo
					src="/video/robots-in-action.mp4"
					poster="/video/robots-in-action.jpg"
					label="Spartronics robots competing on the field"
				/>
			</div>
		</div>
	</section>

	<section class="band tint">
		<div class="wrap">
			<p class="eyebrow">Latest news</p>
			<h2>What we've been up to</h2>
			<div class="grid">
				<PostCard v-for="post in latest" :key="post.path" :post="post" />
			</div>
			<p><NuxtLink to="/news/">All news →</NuxtLink></p>
		</div>
	</section>

	<section class="band">
		<div class="split reverse">
			<div>
				<p class="eyebrow">Join us</p>
				<h2>Join Spartronics</h2>
				<p>
					Are you a high school student who wants to learn engineering, electronics, design, programming, or business
					and marketing? Would you like to grow your skills on industry-grade machines and platforms? You can join at
					any point in the {{ season.label }} season. Check our calendar for meeting dates and come to our next meeting!
				</p>
				<p class="actions">
					<NuxtLink class="button secondary" to="/join/">How to join</NuxtLink>
					<NuxtLink class="button outline-dark" to="/calendar/">Calendar</NuxtLink>
				</p>
			</div>
			<NuxtImg
				src="/images/home/marketing.jpg"
				alt="Spartronics team members at an event"
				width="800"
				format="webp"
				loading="lazy"
				class="photo"
			/>
		</div>
	</section>

	<section class="band tint">
		<div class="wrap narrow">
			<p class="eyebrow">Our history</p>
			<h2>A new robot every year</h2>
			<p>
				Each January, FIRST releases a new game, and every FRC team builds a new robot from scratch to play it. Each
				Spartronics robot is named after a Greek deity that hints at its function and abilities. Explore our robots,
				innovations and milestones since 2013.
			</p>
			<p><NuxtLink class="button secondary" to="/history/">Explore our history</NuxtLink></p>
		</div>
	</section>

	<section class="band sponsors">
		<div class="wrap narrow center">
			<p class="eyebrow">Our sponsors</p>
			<h2>Thank you to our sponsors</h2>
			<p>
				Spartronics relies on community support to teach, build, and compete every season. We thank every sponsor and
				donor for helping us fulfill our mission.
			</p>
			<ul v-if="featuredSponsors.length > 0" class="logos">
				<li v-for="sponsor in featuredSponsors" :key="sponsor.name">
					<NuxtImg :src="sponsor.logo" :alt="sponsor.name" height="80" format="webp" loading="lazy" />
				</li>
			</ul>
			<p class="actions center">
				<NuxtLink class="button" to="/sponsors/">See all sponsors</NuxtLink>
				<NuxtLink class="button outline" to="/sponsors/sponsor-information/">Become a sponsor</NuxtLink>
			</p>
			<p>Questions about sponsoring? Email <a :href="`mailto:${TEAM_EMAIL}`">{{ TEAM_EMAIL }}</a>.</p>
		</div>
	</section>
</template>

<style scoped>
	.hero {
		background: linear-gradient(135deg, var(--blue) 0%, var(--blue-dark) 100%);
		color: white;
	}
	.hero-inner {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 3rem 1rem;
		display: flex;
		align-items: center;
		gap: 2.5rem;
	}
	.hero-logo {
		flex: none;
		width: clamp(140px, 22vw, 260px);
		height: auto;
	}
	.hero h1 {
		color: white;
		text-transform: uppercase;
		font-family: var(--font-logo);
		font-weight: 400;
		letter-spacing: 0.02em;
		margin: 0.25rem 0 0.75rem;
		font-size: clamp(2.1rem, 6vw, 3.5rem);
	}
	.hero h1 span {
		color: var(--yellow);
	}
	.eyebrow.light {
		color: var(--yellow);
	}
	.lead {
		font-size: 1.2rem;
		max-width: 34rem;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.actions.center {
		justify-content: center;
	}
	.button.outline {
		background: transparent;
		color: white;
		border: 2px solid white;
	}
	.button.outline-dark {
		background: transparent;
		color: var(--blue);
		border: 2px solid var(--blue);
	}
	.band {
		padding: 3.5rem 1rem;
	}
	.band.tint {
		background: var(--tint);
	}
	.band h2 {
		margin-top: 0.25rem;
	}
	.wrap {
		max-width: var(--wide);
		margin: 0 auto;
	}
	.wrap.narrow {
		max-width: var(--column);
	}
	.center {
		text-align: center;
	}
	.split {
		max-width: var(--wide);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 2.5rem;
		align-items: center;
	}
	.split.reverse > :first-child {
		order: 2;
	}
	.photo {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: var(--radius);
	}
	.photo.video {
		aspect-ratio: 16 / 9;
		overflow: hidden;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1.25rem;
		margin-bottom: 1rem;
	}
	.logos {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1.5rem 2.5rem;
		list-style: none;
		padding: 0;
		margin: 2rem 0;
	}
	.logos img {
		height: 64px;
		width: auto;
	}
	/* Sponsor logos are white versions made for a blue background. */
	.sponsors {
		background: var(--blue);
		color: white;
	}
	.sponsors h2,
	.sponsors .eyebrow {
		color: white;
	}
	.sponsors .eyebrow {
		opacity: 0.8;
	}
	.sponsors a:not(.button) {
		color: white;
	}
	@media (max-width: 760px) {
		.hero-inner {
			flex-direction: column;
			text-align: center;
			padding: 2rem 1rem 2.5rem;
			gap: 1rem;
		}
		.hero .actions {
			justify-content: center;
		}
		.lead {
			margin-left: auto;
			margin-right: auto;
		}
		.split {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		.split.reverse > :first-child {
			order: 0;
		}
	}
</style>
