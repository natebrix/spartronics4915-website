<script setup lang="ts">
// Counts down to the event in shared/data/countdown.ts. The page is built
// ahead of time, so the numbers fill in once the page loads in the browser,
// and the whole block stays hidden once the event has started.
import { COUNTDOWN } from '~~/shared/data/countdown';

const target = new Date(COUNTDOWN.date).getTime();
const units = ['Days', 'Hours', 'Minutes', 'Seconds'];
// Days, hours, minutes and seconds left, or null while hidden.
const parts = ref<number[] | null>(null);

function tick() {
	const left = target - Date.now();
	if (!(left > 0)) {
		parts.value = null;
		return false;
	}
	const seconds = Math.floor(left / 1000);
	parts.value = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
	return true;
}

let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
	if (tick()) timer = setInterval(() => tick() || clearInterval(timer), 1000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
	<section v-if="parts" class="countdown">
		<h2>Countdown to {{ COUNTDOWN.name }}</h2>
		<ol>
			<li v-for="(unit, i) in units" :key="unit">
				<span class="value">{{ String(parts[i]).padStart(i === 0 ? 1 : 2, '0') }}</span>
				<span class="label">{{ unit }}</span>
			</li>
		</ol>
	</section>
</template>

<style scoped>
	.countdown {
		text-align: center;
		padding: 2rem 1rem;
		background: var(--ink);
		color: white;
	}
	h2 {
		color: var(--yellow);
		margin: 0 0 1rem;
	}
	ol {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		min-width: 4.5rem;
	}
	.value {
		display: block;
		font-size: clamp(2rem, 7vw, 3rem);
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}
	.label {
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgb(255 255 255 / 0.7);
	}
</style>
