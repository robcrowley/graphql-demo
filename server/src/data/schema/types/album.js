import { toGlobalId } from '../../../global';
import { NodeType, ArtistType, LabelType } from './'
import { AlbumOrderFieldType, OrderDirectionType } from './enums';

import { 
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType,
 } from 'graphql';

export const DefaultAlbumOrder = {
    field: AlbumOrderFieldType.getValues().first,
    direction: OrderDirectionType.getValues().first
}

export const AlbumOrderType = new GraphQLInputObjectType({
    name: 'AlbumOrder',
    description: '...',
    fields: {
        field: { type: AlbumOrderFieldType },
        direction: { type: OrderDirectionType }
    }
});

export const AlbumInputType = new GraphQLInputObjectType({
    name: 'AlbumInput',
    fields: {
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        artistId: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        labelId: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    }
});

export const AlbumType = new GraphQLObjectType({
    name: 'AlbumType',
    description: '...',
    interfaces: [NodeType],
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: album => toGlobalId(album, a => a.albumId)
        },
        albumId: { type: GraphQLID },
        title: { type: GraphQLString },
        artist: {
            type: ArtistType,
            resolve: ({ artistId }, args, { loaders }) => loaders.artist.load(artistId)
        },
        label: {
            type: LabelType,
            resolve: ({ labelId }, args, { loaders }) => loaders.label.load(labelId)
        }
    })
});

export default AlbumType;