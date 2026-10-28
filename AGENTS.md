## Development

The site is [Nuxt](https://nuxt.com) 4, built as a static site with
`nuxt generate` (`npm run build`). Content lives in `content/` and is read with
[Nuxt Content](https://content.nuxt.com).

When starting the dev server, run it in the background so it doesn't block:

```
npm run dev
```

It serves http://localhost:3000. Before finishing a change, run `npm run verify`
(type check, build, link check, old-URL check), the same check CI runs.

## Documentation

Consult these guides before working on related tasks:

- [Pages and routing](https://nuxt.com/docs/guide/directory-structure/app/pages)
- [Components](https://nuxt.com/docs/guide/directory-structure/app/components)
- [Data fetching with useAsyncData](https://nuxt.com/docs/getting-started/data-fetching)
- [Prerendering and static hosting](https://nuxt.com/docs/getting-started/prerendering)
- [Content collections](https://content.nuxt.com/docs/collections/define)
- [Querying content](https://content.nuxt.com/docs/utils/query-collection)
- [MDC syntax for components in Markdown](https://content.nuxt.com/docs/files/markdown)
- [Images](https://image.nuxt.com)
- [Nuxt Studio, the visual editor](https://nuxt.studio)
