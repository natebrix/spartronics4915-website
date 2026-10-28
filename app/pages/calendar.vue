<script setup lang="ts">
// Text for this page, including meeting times, is in content/pages/calendar.md.
import { TEAM_EMAIL } from '~~/shared/consts';

const { data: page } = await useAsyncData('page-calendar', () => queryCollection('pages').path('/calendar').first());
if (!page.value) throw createError({ statusCode: 500, statusMessage: 'Missing content/pages/calendar.md', fatal: true });

useSiteHead({ title: page.value.title, description: page.value.description });
</script>

<template>
	<h1>{{ page!.title }}</h1>
	<ContentRenderer :value="page!" />
	<CalendarEmbed />
	<p>
		Questions? Email us at <a :href="`mailto:${TEAM_EMAIL}`">{{ TEAM_EMAIL }}</a>.
	</p>
</template>
