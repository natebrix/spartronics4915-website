// The robot timeline at the top of the Our History page, newest first.
// To add a new season: put the robot's photo in public/images/pages/history/
// and add one entry to the start of the list. Then add a section for the
// season to content/pages/history.md whose heading starts with the same year.

export interface Robot {
	/** The season year. Links to the history.md section whose heading starts with it. */
	year: number;
	name: string;
	/** What the robot's name stands for, if it is an acronym. */
	standsFor?: string;
	/**
	 * That season's FRC game, named the way FIRST writes it, and a link to its
	 * official game animation or kickoff video. FIRST lists these for every
	 * season at https://www.firstinspires.org/resources/library/frc/archived-games
	 */
	game: { name: string; url: string };
	/** A photo under public/, like /images/pages/history/2026-artemis.jpg. */
	image?: string;
	/** Override when the history.md heading doesn't start with the year (like "2013–14"). */
	section?: string;
}

export const ROBOTS: Robot[] = [
	{
		year: 2026,
		name: 'ARTEMIS',
		standsFor: 'Articulating Rotating Turret with Ejection Mechanism with Intake on Swerve',
		game: { name: 'REBUILT', url: 'https://www.youtube.com/playlist?list=PLZT9pIgNOV6Y-gv2OmEdktNjWC8ftqZkK' },
		image: '/images/pages/history/2026-artemis.jpg',
	},
	{ year: 2025, name: 'EPHYRA', game: { name: 'REEFSCAPE', url: 'https://youtu.be/YNyzrkLxAtA' }, image: '/images/pages/history/2025-ephyra.jpg' },
	{ year: 2024, name: 'NEMESIS', standsFor: 'Note Ejection Machine with Elevator-Supported Intake System', game: { name: 'CRESCENDO', url: 'https://www.youtube.com/playlist?list=PLZT9pIgNOV6ai8nBeeLlC1PnDIhhVHV3k' }, image: '/images/pages/history/2024-nemesis.jpg' },
	{ year: 2023, name: 'TALOS', standsFor: 'Telescopic, Actuated Lifter On Swerve', game: { name: 'CHARGED UP', url: 'https://www.youtube.com/playlist?list=PLZT9pIgNOV6Z1KGc3k1GswZmKvrYbPlmU' }, image: '/images/pages/history/2023-talos.jpg' },
	{ year: 2022, name: 'HERMES', game: { name: 'RAPID REACT', url: 'https://www.youtube.com/playlist?list=PLZT9pIgNOV6ZZ0Nlwte7ZaE-_DGoAFPQF' }, image: '/images/pages/history/2022-hermes.jpg' },
	{ year: 2020, name: 'ATHENA', standsFor: 'Ascending Turreted Hyper Elevating Navigating Assembly', game: { name: 'INFINITE RECHARGE', url: 'https://www.youtube.com/watch?v=gmiYWTmFRVE' }, image: '/images/pages/history/2020-athena.jpg' },
	{ year: 2019, name: 'CHAOS', standsFor: 'Cargo Hatch-panel Ascending Operational System', game: { name: 'Destination: Deep Space', url: 'https://youtu.be/Mew6G_og-PI' } },
	{ year: 2018, name: 'THEMIS', standsFor: 'THE Mechanical Intake Scissor-lift', game: { name: 'FIRST POWER UP', url: 'https://www.youtube.com/watch?v=HZbdwYiCY74' }, image: '/images/pages/history/2018-themis.jpg' },
	{ year: 2017, name: 'HELIOS', standsFor: 'Highly Efficient Launcher and Intake Oriented System', game: { name: 'FIRST STEAMWORKS', url: 'https://www.youtube.com/watch?v=EMiNmJW7enI' } },
	{ year: 2016, name: 'ARES', standsFor: 'Advanced Robot Engineered for Siege', game: { name: 'FIRST STRONGHOLD', url: 'https://www.youtube.com/watch?v=VqOKzoHJDjA' }, image: '/images/pages/history/2016-ares-wheels.jpg' },
	{ year: 2015, name: 'GAEA', standsFor: 'Grabbing Actuated Elevator Automaton', game: { name: 'RECYCLE RUSH', url: 'https://youtu.be/W6UYFKNGHJ8' }, image: '/images/pages/history/2015-gaea.jpg' },
	{ year: 2014, name: 'ATLaS', standsFor: 'Advanced Tele-operated Launching System', game: { name: 'AERIAL ASSIST', url: 'https://www.youtube.com/watch?v=f5zWzICG5to' }, image: '/images/pages/history/2014-atlas.jpg', section: '2013' },
];
