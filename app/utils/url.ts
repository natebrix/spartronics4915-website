import { withTrailingSlash } from 'ufo';

/** A post's or page's link. Every URL on the site ends in a slash, like /history/. */
export function pageUrl(path: string) {
	return withTrailingSlash(path);
}
