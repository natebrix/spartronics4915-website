import { SPONSOR_TIER_IDS } from '~~/shared/data/sponsorTiers';

/** All sponsors, by tier, then by position within the tier, then by name. */
export function useSponsors() {
	return useAsyncData('sponsors', async () => {
		const sponsors = await queryCollection('sponsors').all();
		return sponsors.sort(
			(a, b) =>
				SPONSOR_TIER_IDS.indexOf(a.tier) - SPONSOR_TIER_IDS.indexOf(b.tier) ||
				(a.position ?? Infinity) - (b.position ?? Infinity) ||
				a.name.localeCompare(b.name),
		);
	});
}
