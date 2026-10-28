/**
 * The season under way when the site was built. Kept in the page's data so
 * the browser shows the same season the built page does.
 */
export function useSeason() {
	return useState('season', () => currentSeason());
}
