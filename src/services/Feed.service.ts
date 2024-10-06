class FeedService {
    getUserFeed(userId: string) {
        return { status: true, message: 'User feed found' };
    }
}

const feedService = new FeedService();
export default feedService;