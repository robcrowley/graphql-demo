import db from 'sqlite';

const getLabels = ids => db
    .all(`SELECT * FROM Label WHERE labelId IN (${parameterize(ids)})`, ids);

const getArtists = ids => db
    .all(`SELECT * FROM Artist WHERE artistId IN (${parameterize(ids)})`, ids);

const getAlbums = ids => db
    .all(`SELECT * FROM Album WHERE albumId IN (${parameterize(ids)})`, ids);

const getAlbumIdsByLabel = (ids, first) => db
    .all(`SELECT albumId FROM Album WHERE labelId IN (${parameterize(ids)}) LIMIT ?`, asArray(ids).concat(first))
    .then(rows => rows.map(({albumId}) => albumId));

const getAlbumIdsByArtist = (ids, first) => db
    .all(`SELECT albumId FROM Album WHERE artistId IN (${parameterize(ids)}) LIMIT ?`, asArray(ids).concat(first))
    .then(rows => rows.map(({albumId}) => albumId));

const addAlbum = (title, artistId, labelId) => db
    .run('INSERT INTO Album (title, artistId, labelId) VALUES ($title, $artistId, $labelId)', {
        $title: title,
        $artistId: artistId,
        $labelId: labelId
    })
    .then(({lastID}) => lastID);

const getAlbumReviewIdsByAlbum = (ids, first) => db
    .all(`SELECT albumReviewId FROM AlbumReview WHERE albumId IN (${parameterize(ids)}) LIMIT ?`, asArray(ids).concat(first))
    .then(rows => rows.map(({albumReviewId}) => albumReviewId));

const getAlbumReviewIdsByUser = (ids, first) => db
    .all(`SELECT albumReviewId FROM AlbumReview WHERE userId IN (${parameterize(ids)}) LIMIT ?`, asArray(ids).concat(first))
    .then(rows => rows.map(({albumReviewId}) => albumReviewId));

const getAlbumReviews = ids => db
    .all(`SELECT * FROM AlbumReview WHERE albumReviewId IN (${parameterize(ids)})`, ids);

const addAlbumReview = (albumId, userId, content, rating) => db
    .run('INSERT INTO AlbumReview (albumId, userId, content, rating) VALUES ($albumId, $userId, $content, $rating)', {
        $albumId: albumId,
        $userId: userId,
        $content: content,
        $rating: rating
    })
    .then(({lastID}) => lastID);

const getUser = id => db
    .get(`SELECT * FROM User WHERE userId = ?`, id);

const getUserByLogin = login => db
    .get(`SELECT * FROM User WHERE login = ?`, login);

const getArtistWatches = ids => db
    .all(`SELECT * FROM ArtistWatch WHERE artistWatchId IN (${parameterize(ids)})`, ids);

const getArtistWatchIdsByUser = (ids, first) => db
    .all(`SELECT artistWatchId FROM ArtistWatch WHERE userId IN (${parameterize(ids)}) LIMIT ?`, asArray(ids).concat(first))
    .then(rows => rows.map(({artistWatchId}) => artistWatchId));

const parameterize = params => asArray(params).map(param => '?').join();

const asArray = a => Array.isArray(a) ? a : [a];

export default {
    getLabels,
    getArtists,
    getArtistWatchIdsByUser,
    getArtistWatches,
    getAlbums,
    getAlbumIdsByLabel,
    getAlbumIdsByArtist,
    getAlbumReviews,
    getAlbumReviewIdsByUser,
    getAlbumReviewIdsByAlbum,
    addAlbum,
    addAlbumReview,
    getUser,
    getUserByLogin
};