// Sponsorship levels, shared by the Sponsors and Sponsor Information pages.
// The order here is the order they appear on the site.
export const SPONSOR_TIERS = [
	{
		id: 'pantheon',
		name: 'Pantheon',
		amount: '$10,000+',
		benefits: [
			'Large logo on all promotional materials',
			'Large logo on robot, website, banner, and team shirts',
			'Team thank-you photo',
			'Social media shout-out',
			'Robot visit (upon request)',
		],
	},
	{
		id: 'platinum',
		name: 'Platinum',
		amount: '$5,000+',
		benefits: [
			'Medium logo on all promotional materials',
			'Logo on robot, website, banner, and team shirts',
			'Team thank-you photo',
			'Social media shout-out',
			'Robot visit (upon request)',
		],
	},
	{
		id: 'gold',
		name: 'Gold',
		amount: '$2,000+',
		benefits: ['Small/medium logo on website, banner, and team shirts', 'Team thank-you photo', 'Social media shout-out'],
	},
	{
		id: 'silver',
		name: 'Silver',
		amount: '$1,000+',
		benefits: ['Small logo on website and banner', 'Name on team shirts', 'Social media shout-out'],
	},
	{
		id: 'bronze',
		name: 'Bronze',
		amount: '$500+',
		benefits: ['Name on website, banner, and shirt', 'Social media shout-out'],
	},
	{
		id: 'supporting',
		name: 'Supporting',
		amount: '$250+',
		benefits: ['Name on website', 'Social media shout-out'],
	},
	{
		id: 'friends',
		name: 'Friends',
		amount: 'Up to $250',
		benefits: ['Team acknowledgment on social media'],
	},
] as const;

export type SponsorTierId = (typeof SPONSOR_TIERS)[number]['id'];
export const SPONSOR_TIER_IDS = SPONSOR_TIERS.map((tier) => tier.id) as [SponsorTierId, ...SponsorTierId[]];
