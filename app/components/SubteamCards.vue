<script setup lang="ts">
// Cards for each subteam in content/subteams/. A card shows a photo when the
// subteam's file has one.
const { data: subteams } = await useAsyncData('subteams', () => queryCollection('subteams').order('order', 'ASC').all());
</script>

<template>
	<div class="grid">
		<article v-for="team in subteams" :key="team.id" class="card">
			<NuxtImg
				v-if="team.photo"
				:src="team.photo"
				:alt="`${team.name} subteam`"
				width="640"
				height="400"
				fit="cover"
				format="webp"
				loading="lazy"
			/>
			<div class="body">
				<h3>{{ team.name }}</h3>
				<p>{{ team.summary }}</p>
			</div>
		</article>
	</div>
</template>

<style scoped>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		gap: 1.25rem;
	}
	.card {
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--paper);
	}
	img {
		width: 100%;
		aspect-ratio: 8 / 5;
		object-fit: cover;
		display: block;
	}
	.body {
		padding: 1rem 1.1rem 1.25rem;
	}
	h3 {
		margin: 0 0 0.5rem;
		color: var(--blue);
	}
	p {
		margin: 0;
		font-size: 0.97rem;
	}
</style>
