import {
    GraphQLID,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

import { 
    NodeType,
    UserType,
    LabelType, 
    AlbumType,
    ArtistType, 
    AlbumInputType,
    AlbumOrderType,
    ArtistWatchType,
    DefaultAlbumOrder, 
    AlbumOrderFieldType, 
    OrderDirectionType,
    AlbumAddedEventType,
} from './types';

import { withFilter } from 'graphql-subscriptions';
import { mediator, topics } from '../subscriptions';
import { Album, ArtistWatch } from '../../models';
import { extractId } from '../../global';

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: {
        label: {
            type: LabelType,
            args: {
                id: { type: GraphQLID },
                labelId: { type: GraphQLID }
            },
            resolve: (root, args, { loaders }) => loaders.label.load(extractId(args, 'labelId'))
        },
        artist: {
            type: ArtistType,
            args: {
                id: { type: GraphQLID },
                artistId: { type: GraphQLID }
            },
            resolve: (root, args, { loaders }) => loaders.artist.load(extractId(args, 'artistId'))
        },
        album: {
            type: AlbumType,
            args: {
                id: { type: GraphQLID },
                albumId: { type: GraphQLID }
            },
            resolve: (root, args, { loaders }) => loaders.album.load(extractId(args, 'albumId'))
        },
        user: {
            type: UserType,
            args: {
                login: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (root, args, { loaders }) => loaders.userByLogin.load(args.login)
        },
    }
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAlbum: {
            type: AlbumType,
            args: {
                album: {
                    type: new GraphQLNonNull(AlbumInputType)
                }
            },
            resolve: (root, { album }, { loaders }) => Album
                .add(album)
                .then(id => loaders.album.load(id))
                .then(({ artistId, albumId }) => {
                    mediator.publish(topics.ALBUM_ADDED, { [topics.ALBUM_ADDED]: { artistId, albumId } });
                    return album;
                })
        }
    }
});

const SubscriptionType = new GraphQLObjectType({
    name: 'Subscription',
    description: '...',
    fields: {
        albumAdded: {
            type: AlbumAddedEventType,
            args: {
                userId: { type: GraphQLID }
            },
            subscribe: withFilter(
                () => mediator.asyncIterator(topics.ALBUM_ADDED),
                async ({ albumAdded : album }, { userId }, { viewer }) => {
                    const isRelevant = await ArtistWatch.getByUser(viewer, userId)
                        .then(watches => watches.map(({ artistId }) => artistId))
                        .then(ids => ids.includes(album.artistId));

                    if (!isRelevant) {
                        console.log(`Filtered out subscription for '${topics.ALBUM_ADDED}' event.`);
                    }
                    return isRelevant;
                })
        }
    }
});

export const schema = new GraphQLSchema({
    types: [NodeType, ArtistType, AlbumType, ArtistWatchType, LabelType],
    query: QueryType,
    mutation: MutationType,
    subscription: SubscriptionType
});

export default schema;