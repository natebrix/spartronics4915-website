<script setup lang="ts">
import { SOCIAL_LINKS, TEAM_ADDRESS, TEAM_EMAIL } from '~~/shared/consts';

const year = useState('year', () => new Date().getFullYear());
</script>

<template>
	<footer class="site-footer">
		<div class="inner">
			<div>
				<p class="name">Spartronics · FRC Team 4915</p>
				<p>Bainbridge High School · {{ TEAM_ADDRESS }}</p>
				<p><a :href="`mailto:${TEAM_EMAIL}`">{{ TEAM_EMAIL }}</a></p>
				<p class="more">
					<NuxtLink to="/news/">News</NuxtLink> · <NuxtLink to="/awards/">Awards</NuxtLink> ·
					<NuxtLink to="/resources/">Resources</NuxtLink> · <a href="/rss.xml">RSS</a>
				</p>
			</div>
			<ul class="social">
				<li v-for="link in SOCIAL_LINKS" :key="link.href">
					<a :href="link.href">{{ link.label }}</a>
				</li>
			</ul>
		</div>
		<p class="copyright">&copy; {{ year }} Spartronics 4915. Built and maintained by Spartronics students.</p>
	</footer>
</template>

<style scoped>
	.site-footer {
		background: var(--ink);
		color: rgb(255 255 255 / 0.85);
		margin-top: 4rem;
		padding: 2.5rem 1rem 1.5rem;
		font-size: 0.95rem;
	}
	.inner {
		max-width: var(--wide);
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 1.5rem;
	}
	p {
		margin: 0.25rem 0;
	}
	.more {
		margin-top: 0.75rem;
	}
	.name {
		font-weight: 700;
		color: var(--yellow);
		font-size: 1.1rem;
	}
	a {
		color: white;
	}
	.social {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.copyright {
		max-width: var(--wide);
		margin: 2rem auto 0;
		font-size: 0.85rem;
		color: rgb(255 255 255 / 0.6);
	}
</style>
