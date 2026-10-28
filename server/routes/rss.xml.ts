// The news feed at /rss.xml, written out as a file when the site builds. The
// old WordPress feed was at /feed/; public/_redirects sends it here.
import { queryCollection } from '@nuxt/content/server';
import { withTrailingSlash } from 'ufo';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '~~/shared/consts';

const escape = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default defineEventHandler(async (event) => {
	const posts = await queryCollection(event, 'posts')
		.order('date', 'DESC')
		.order('stem', 'ASC')
		.select('path', 'title', 'summary', 'date')
		.all();
	const items = posts.map((post) => {
		const link = new URL(withTrailingSlash(post.path), SITE_URL).href;
		return `<item><title>${escape(post.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${escape(post.summary)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`;
	});

	setHeader(event, 'content-type', 'application/xml; charset=utf-8');
	return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(SITE_TITLE)}</title><description>${escape(SITE_DESCRIPTION)}</description><link>${SITE_URL}/</link>${items.join('')}</channel></rss>`;
});
