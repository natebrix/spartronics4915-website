<script setup lang="ts">
const props = defineProps<{ date: string | Date }>();
const date = computed(() => new Date(props.date));
</script>

<template>
	<time :datetime="date.toISOString().slice(0, 10)">
		{{
			date.toLocaleDateString('en-us', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				// Post dates have no time of day; without this they can show a day early.
				timeZone: 'UTC',
			})
		}}
	</time>
</template>
