<script setup lang="ts">
import { NAV_LINKS } from '~~/shared/consts';

// Markdown pages with `menu: true` join the built-in links.
const { data: menuPages } = await useAsyncData('menu-pages', () =>
	queryCollection('pages').select('path', 'title', 'menu').all(),
);
const links = computed(() => [
	...NAV_LINKS,
	...(menuPages.value ?? []).filter((page) => page.menu).map((page) => ({ href: pageUrl(page.path), label: page.title })),
]);

const route = useRoute();
const isCurrent = (href: string) => {
	const current = pageUrl(route.path);
	return href === '/' ? current === '/' : current === href || (href !== '/sponsors/' && current.startsWith(href));
};

// On small screens the menu collapses behind a button. Close it after
// following a link.
const open = ref(false);
watch(() => route.path, () => (open.value = false));
</script>

<template>
	<header class="site-header">
		<div class="inner">
			<NuxtLink class="brand" to="/">
				<NuxtImg src="/images/brand/logo.png" alt="" width="56" height="56" />
				<span>Spartronics <strong>4915</strong></span>
			</NuxtLink>
			<button class="menu-button" type="button" :aria-expanded="open" aria-controls="main-nav" @click="open = !open">
				Menu
			</button>
			<nav id="main-nav" :class="{ open }" aria-label="Main">
				<ul>
					<li v-for="link in links" :key="link.href">
						<NuxtLink :to="link.href" :aria-current="isCurrent(link.href) ? 'page' : undefined">
							{{ link.label }}
						</NuxtLink>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<style scoped>
	.site-header {
		background: var(--blue);
		color: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}
	.inner {
		max-width: var(--wide);
		margin: 0 auto;
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: white;
		text-decoration: none;
		font-family: var(--font-logo);
		font-size: 1.6rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}
	.brand strong {
		color: var(--yellow);
	}
	.brand img {
		width: 48px;
		height: 48px;
	}
	.menu-button {
		display: none;
	}
	nav ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	nav a {
		display: block;
		padding: 0.5rem 0.75rem;
		color: white;
		text-decoration: none;
		font-weight: 600;
		border-bottom: 3px solid transparent;
	}
	nav a:hover,
	nav a[aria-current='page'] {
		border-bottom-color: var(--yellow);
	}

	@media (max-width: 480px) {
		.brand {
			font-size: 1.05rem;
			gap: 0.5rem;
			white-space: nowrap;
		}
		.brand img {
			width: 40px;
			height: 40px;
		}
	}

	/* On small screens the menu collapses behind a button. */
	@media (max-width: 960px) {
		.inner {
			position: relative;
		}
		.menu-button {
			display: block;
			cursor: pointer;
			background: none;
			color: white;
			font: inherit;
			padding: 0.5rem 0.9rem;
			border: 2px solid var(--yellow);
			border-radius: 6px;
			font-weight: 700;
		}
		nav {
			display: none;
			position: absolute;
			right: 1rem;
			top: 100%;
			background: var(--blue-dark);
			border-radius: 8px;
			padding: 0.5rem;
			min-width: 14rem;
			box-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
		}
		nav.open {
			display: block;
		}
		nav ul {
			flex-direction: column;
		}
	}
</style>
