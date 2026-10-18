// Custom tags for posts and pages (.mdoc files). Each one has a matching
// block in keystatic.config.ts so writers can insert it from the editor.
import { component, defineMarkdocConfig } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
	tags: {
		youtube: {
			render: component('./src/components/YouTube.astro'),
			selfClosing: true,
			attributes: {
				url: { type: String, required: true },
				title: { type: String },
			},
		},
	},
});
