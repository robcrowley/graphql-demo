import dao from '../data/connectors';

export class Artist {
    constructor({ artistId, name, website } = {}) {
        this.artistId = artistId;
        this.name = name;
        this.website = website;
    }

    static async get(viewer, ids) {
        const data = await dao.getArtists(ids);
        return data.map(item => new Artist(item));
    }
}

export default Artist;