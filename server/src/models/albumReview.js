import dao from '../data/connectors';

export class AlbumReview {
    constructor({ albumReviewId, albumId, userId, content, rating, dateCreated } = {}) {
        this.albumReviewId = albumReviewId;
        this.albumId = albumId;
        this.userId = userId;
        this.rating = rating;
        this.content = content;
        this.dateCreated = dateCreated;
    }

    static async get(viewer, ids) {
        const data = await dao.getAlbumReviews(ids);
        return data.map(item =>new AlbumReview(item));
    }

    static async getByUser(viewer, ids, first = 10) {
        return dao.getAlbumReviewIdsByUser(ids, first)
            .then(ids => AlbumReview.get(viewer, ids));
    }
    
    static async getByAlbum(viewer, ids, first = 10) {
        return dao.getAlbumReviewIdsByAlbum(ids, first)
            .then(ids => AlbumReview.get(viewer, ids));
    }
    
    static async add({ albumId, userId, content, rating } = {}) {
        return dao.addAlbumReview(albumId, userId, content, rating);
    }
}

export default AlbumReview