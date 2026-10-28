<script setup lang="ts">
// Links in posts and pages are ordinary links that load a whole new page.
// Many point at old WordPress addresses that only work through the redirects
// in public/_redirects, which in-app navigation would skip.
defineProps<{ href?: string; target?: string }>();
</script>

<template>
	<a :href="href" :target="target"><slot /></a>
</template>
