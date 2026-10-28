<script setup lang="ts">
// A YouTube video, from ::youtube-video{url="..."} in posts and pages.
const props = withDefaults(
	defineProps<{
		// Any YouTube link (watch, youtu.be, shorts or embed) or a bare video ID.
		url: string;
		title?: string;
	}>(),
	{ title: 'YouTube video' },
);

const id = props.url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/)?.[1] ?? props.url.trim();
if (!/^[\w-]{11}$/.test(id)) throw new Error(`Not a YouTube video: ${props.url}`);
</script>

<template>
	<iframe
		:src="`https://www.youtube-nocookie.com/embed/${id}`"
		:title="title"
		loading="lazy"
		allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	></iframe>
</template>
