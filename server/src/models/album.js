import dao from '../data/connectors';

export class Album {
    constructor({ albumId, title, artistId, labelId } = {}) {
        this.albumId = albumId;
        this.title = title;
        this.artistId = artistId;
        this.labelId = labelId;
    }

    static async get(viewer, ids) {
        const data = await dao.getAlbums(ids);
        return data.map(item => new Album(item));
    }

    static async getByLabel(viewer, ids, first) {
        return dao.getAlbumIdsByLabel(ids, first).then(ids => Album.get(viewer, ids));
    }

    static async getByArtist(viewer, ids, first) {
        return dao.getAlbumIdsByArtist(ids, first).then(ids => Album.get(viewer, ids));
    }

    static async add({ title, artistId, labelId } = {}) {
        return dao.addAlbum(title, artistId, labelId);
    }
}

export default Album;