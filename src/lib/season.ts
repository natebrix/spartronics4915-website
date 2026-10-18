// Season numbering. Spartronics' first season started in fall 2013 and
// competed in spring 2014, so fall 2026 starts season 14.

const FIRST_SEASON_START_YEAR = 2013;
// A new season starts with the school year.
const SEASON_START_MONTH = 7; // August (January is 0)

/** The season under way on `date`: its number and a label like "2026–2027". */
export function currentSeason(date = new Date()) {
	const startYear = date.getMonth() >= SEASON_START_MONTH ? date.getFullYear() : date.getFullYear() - 1;
	return {
		number: startYear - FIRST_SEASON_START_YEAR + 1,
		label: `${startYear}–${startYear + 1}`,
	};
}

/** 1 → "1st", 14 → "14th", 22 → "22nd". */
export function ordinal(n: number) {
	const suffix = ['th', 'st', 'nd', 'rd'];
	const v = n % 100;
	return n + (suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]);
}
