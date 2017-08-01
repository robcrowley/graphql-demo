import { GraphQLID, GraphQLObjectType } from 'graphql';

import { NodeType, ArtistType, AlbumType, UserType } from './';
import { toGlobalId } from '../../../global';
import { Album } from '../../../models';

export const ArtistWatchType = new GraphQLObjectType({
    name: 'ArtistWatchType',
    description: '...',
    interfaces: [NodeType],
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: watch => toGlobalId(watch, u => u.artistWatchId)
        },
        artist: {
            type: ArtistType,
            resolve: (watch, args, { loaders }) => loaders.artist.load(watch.artistId)
        },
        user: {
            type: UserType,
            resolve: (watch, args, { loaders }) => loaders.user.load(watch.userId)
        }
    })
});

export default ArtistWatchType;