import { getCollection } from 'astro:content';

/** All news posts, newest first. */
export async function getPosts() {
	const posts = await getCollection('posts');
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
