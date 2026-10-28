/**
 * News posts, newest first (by file name on the same day), with the fields a
 * post card needs. Pass `limit` for just the latest few.
 */
export function usePosts(limit?: number) {
	return useAsyncData(`posts-${limit ?? 'all'}`, () => {
		const query = queryCollection('posts')
			.order('date', 'DESC')
			.order('stem', 'ASC')
			.select('path', 'title', 'date', 'summary', 'cover');
		return limit ? query.limit(limit).all() : query.all();
	});
}
