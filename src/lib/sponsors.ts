import { getCollection } from 'astro:content';
import { SPONSOR_TIER_IDS } from '../data/sponsorTiers';

/** All sponsors, by tier, then by position within the tier, then by name. */
export async function getSponsors() {
	const sponsors = await getCollection('sponsors');
	return sponsors.sort(
		(a, b) =>
			SPONSOR_TIER_IDS.indexOf(a.data.tier) - SPONSOR_TIER_IDS.indexOf(b.data.tier) ||
			(a.data.position ?? Infinity) - (b.data.position ?? Infinity) ||
			a.data.name.localeCompare(b.data.name),
	);
}
