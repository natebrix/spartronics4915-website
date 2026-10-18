// The robot timeline at the top of the Our History page, oldest first.
// To add a new season: put the robot's photo in src/assets/history/, import
// it below, and add one entry to the end of the list. Then add a section for
// the season to history.md whose heading starts with the same year.
import type { ImageMetadata } from 'astro';
import atlas from '../../assets/history/2014-atlas.jpg';
import gaea from '../../assets/history/2015-gaea.jpg';
import ares from '../../assets/history/2016-ares-wheels.jpg';
import themis from '../../assets/history/2018-themis.jpg';
import athena from '../../assets/history/2020-athena.jpg';
import hermes from '../../assets/history/2022-hermes.jpg';
import talos from '../../assets/history/2023-talos.jpg';
import nemesis from '../../assets/history/2024-nemesis.jpg';
import ephyra from '../../assets/history/2025-ephyra.jpg';

export interface Robot {
	/** The season year. Links to the history.md section whose heading starts with it. */
	year: number;
	name: string;
	/** What the robot's name stands for, if it is an acronym. */
	standsFor?: string;
	/** That season's FRC game. */
	game: string;
	image?: ImageMetadata;
	/** Override when the history.md heading doesn't start with the year (like "2013–14"). */
	section?: string;
}

export const ROBOTS: Robot[] = [
	{ year: 2014, name: 'ATLaS', standsFor: 'Advanced Tele-operated Launching System', game: 'Aerial Assist', image: atlas, section: '2013' },
	{ year: 2015, name: 'GAEA', standsFor: 'Grabbing Actuated Elevator Automaton', game: 'Recycle Rush', image: gaea },
	{ year: 2016, name: 'ARES', standsFor: 'Advanced Robot Engineered for Siege', game: 'Stronghold', image: ares },
	{ year: 2017, name: 'HELIOS', standsFor: 'Highly Efficient Launcher and Intake Oriented System', game: 'Steamworks' },
	{ year: 2018, name: 'THEMIS', standsFor: 'THE Mechanical Intake Scissor-lift', game: 'Power Up', image: themis },
	{ year: 2019, name: 'CHAOS', standsFor: 'Cargo Hatch-panel Ascending Operational System', game: 'Destination: Deep Space' },
	{ year: 2020, name: 'ATHENA', standsFor: 'Ascending Turreted Hyper Elevating Navigating Assembly', game: 'Infinite Recharge', image: athena },
	{ year: 2022, name: 'HERMES', game: 'Rapid React', image: hermes },
	{ year: 2023, name: 'TALOS', standsFor: 'Telescopic, Actuated Lifter On Swerve', game: 'Charged Up', image: talos },
	{ year: 2024, name: 'NEMESIS', standsFor: 'Note Ejection Machine with Elevator-Supported Intake System', game: 'Crescendo', image: nemesis },
	{ year: 2025, name: 'EPHYRA', game: 'Reefscape', image: ephyra },
];
