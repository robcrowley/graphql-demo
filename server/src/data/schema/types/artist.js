import {
    GraphQLInt,
    GraphQLID,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLEnumType,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

import { GraphQLURL } from 'graphql-custom-types';

import { NodeType, AlbumType, AlbumOrderType, DefaultAlbumOrder } from './';
import { toGlobalId } from '../../../global';
import { Album } from '../../../models';

export const ArtistType = new GraphQLObjectType({
    name: 'ArtistType',
    description: '...',
    interfaces: [NodeType],
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: artist => toGlobalId(artist, a => a.artistId)
        },
        artistId: { type: GraphQLID },
        name: { type: GraphQLString },
        website: { type: GraphQLURL },
        albumsList: {
            type: new GraphQLList(AlbumType),
            args: {
                first: {
                    type: GraphQLInt,
                    defaultValue: 10
                },
                orderBy: {
                    type: AlbumOrderType,
                    defaultValue: DefaultAlbumOrder
                }
            },
            resolve: ({ artistId }, { first, orderBy }, { viewer }) => Album.getByArtist(viewer, artistId, first)
        }
    })
});

export default ArtistType;