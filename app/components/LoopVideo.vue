<script setup lang="ts">
// A short, silent, looping video in place of a photo. It starts once it
// scrolls into view, never for visitors who ask for reduced motion, and has
// a pause button (moving content longer than five seconds needs one).
// Files go in public/video/: an .mp4 (H.264, no audio) and a .jpg poster.
defineProps<{
	src: string;
	poster: string;
	// What the video shows, for screen readers.
	label: string;
}>();

const video = ref<HTMLVideoElement>();
const playing = ref(false);
// The button only works once the page's scripts load.
const ready = ref(false);
// Set once the visitor presses pause, so scrolling doesn't restart it.
let pausedByVisitor = false;
let observer: IntersectionObserver | undefined;

function toggle() {
	const el = video.value!;
	pausedByVisitor = !el.paused;
	if (el.paused) el.play().catch(() => {});
	else el.pause();
}

onMounted(() => {
	const el = video.value!;
	pausedByVisitor = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	ready.value = true;
	observer = new IntersectionObserver(([entry]) => {
		if (!entry?.isIntersecting) el.pause();
		else if (!pausedByVisitor) el.play().catch(() => {});
	});
	observer.observe(el);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
	<div class="loop-video" :class="{ playing }">
		<video
			ref="video"
			:src="src"
			:poster="poster"
			muted
			loop
			playsinline
			preload="none"
			:aria-label="label"
			@play="playing = true"
			@pause="playing = false"
		></video>
		<button type="button" class="toggle" :aria-label="playing ? 'Pause video' : 'Play video'" :hidden="!ready" @click="toggle">
			<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>
			<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"></path></svg>
		</button>
	</div>
</template>

<style scoped>
	.loop-video {
		position: relative;
		height: 100%;
	}
	video {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
	}
	.toggle {
		position: absolute;
		right: 0.6rem;
		bottom: 0.6rem;
		width: 2.25rem;
		height: 2.25rem;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: rgb(0 0 0 / 0.55);
		color: #fff;
		cursor: pointer;
	}
	.toggle:hover {
		background: rgb(0 0 0 / 0.75);
	}
	.toggle svg {
		width: 1.1rem;
		height: 1.1rem;
		fill: currentColor;
	}
	.icon-pause,
	.playing .icon-play {
		display: none;
	}
	.playing .icon-pause {
		display: block;
	}
</style>
