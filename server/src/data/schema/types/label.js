import { NodeType, AlbumType, AlbumOrderType, DefaultAlbumOrder } from './';
import { toGlobalId } from '../../../global';
import { Album } from '../../../models';
import { 
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType,
 } from 'graphql';

export const LabelType = new GraphQLObjectType({
    name: 'LabelType',
    description: '...',
    interfaces: [NodeType],
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: label => toGlobalId(label, l => l.labelId)
        },
        labelId: { type: GraphQLID },
        name: { type: GraphQLString },
        founded: { type: GraphQLInt },
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
            resolve: ({ labelId }, { first, orderBy }, { viewer }) => Album.getByLabel(viewer, labelId, first)
        }
    })
});

export default LabelType;