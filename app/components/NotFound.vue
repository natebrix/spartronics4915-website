<template>
	<section class="not-found">
		<p class="eyebrow">404</p>
		<h1>We couldn't find that page</h1>
		<p>It may have moved when we rebuilt the website. Try one of these instead:</p>
		<p class="actions">
			<NuxtLink class="button" to="/">Home</NuxtLink>
			<NuxtLink class="button secondary" to="/news/">All news</NuxtLink>
		</p>
	</section>
</template>

<style scoped>
	.not-found {
		text-align: center;
		padding: 3rem 0;
	}
	.actions {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
</style>
