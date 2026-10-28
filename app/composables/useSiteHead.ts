import { SITE_TITLE, SITE_URL } from '~~/shared/consts';

interface SiteHead {
	title: string;
	description: string;
	// The picture shown when the page is shared, a path under public/.
	image?: string;
	// Keep the page out of search engines (it's still reachable by its link).
	noindex?: boolean;
}

/** Sets a page's title, description, canonical URL and sharing tags. */
export function useSiteHead({ title, description, image = '/images/brand/logo.png', noindex = false }: SiteHead) {
	const route = useRoute();
	const img = useImage();
	const fullTitle = title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`;
	const url = new URL(route.path, SITE_URL).href;

	useHead({
		title: fullTitle,
		link: [
			{ rel: 'canonical', href: url },
			{ rel: 'sitemap', href: '/sitemap.xml' },
			{ rel: 'alternate', type: 'application/rss+xml', title: SITE_TITLE, href: `${SITE_URL}/rss.xml` },
		],
	});
	useSeoMeta({
		description,
		robots: noindex ? 'noindex' : undefined,
		ogType: 'website',
		ogUrl: url,
		ogTitle: fullTitle,
		ogDescription: description,
		ogImage: new URL(img(image, { width: 1200, format: 'jpg' }), SITE_URL).href,
		twitterCard: 'summary_large_image',
	});
}
