import { toGlobalId } from '../../../global';
import { AlbumReview } from '../../../models';
import { NodeType, ArtistType, LabelType, AlbumReviewType } from './'
import { AlbumOrderFieldType, OrderDirectionType } from './enums';

import { 
    GraphQLID,
    GraphQLInt,
    GraphQLList,
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
    description: '...',
    fields: {
        title: {
            type: new GraphQLNonNull(GraphQLString)
        },
        artistId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        labelId: {
            type: new GraphQLNonNull(GraphQLID)
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
        },
        reviewList: {
             type: new GraphQLList(AlbumReviewType),
            args: {
                first: {
                    type: GraphQLID,
                    defaultValue: 10
                }
            },
            resolve: ({ albumId }, { first }, { viewer }) => AlbumReview.getByAlbum(viewer, albumId, first)
        }
    })
});

export default AlbumType;