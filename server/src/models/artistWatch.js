import dao from '../data/connectors';

export class ArtistWatch {
    constructor({ artistWatchId, userId, artistId } = {}) {
        this.artistWatchId = artistWatchId;
        this.userId = userId;
        this.artistId = artistId;
    }

    static isAccessibleTo(viewer, { userId } = {}) {
        return viewer.userId === userId;
    }

    static async get(viewer, ids) {
        const data = await dao.getArtistWatches(ids);
        return data.map(item => ArtistWatch.isAccessibleTo(viewer, item) ? new ArtistWatch(item) : null);
    }

    static async getByUser(viewer, ids, first = 10) {
        return dao.getArtistWatchIdsByUser(ids, first)
            .then(ids => ArtistWatch.get(viewer, ids));
    }
}

export default ArtistWatch