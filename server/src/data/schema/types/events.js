import { GraphQLObjectType } from 'graphql';
import { ArtistType, AlbumType } from './';

export const AlbumAddedEventType = new GraphQLObjectType({
    name: 'AlbumAddedEvent',
    description: '...',
    fields: {
        artist: {
            type: ArtistType,
            resolve: ({ artistId }, args, { loaders }) => loaders.artist.load(artistId)
        },
        album: {
            type: AlbumType,
            resolve: ({ albumId }, args, { loaders }) => loaders.album.load(albumId)
        }
    }
});

export default AlbumAddedEventType;