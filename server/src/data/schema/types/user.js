import { toGlobalId } from '../../../global';
import { AlbumReview, ArtistWatch } from '../../../models';

import { 
    NodeType, 
    AlbumType, 
    AlbumOrderType, 
    AlbumReviewType,
    ArtistWatchType, 
    DefaultAlbumOrder
} from './';

import { 
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLString,
    GraphQLObjectType
 } from 'graphql';

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: 'Represents a user within the sytem.',
    interfaces: [NodeType],
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: user => toGlobalId(user, u => u.userId)
        },
        userId: { type: GraphQLID },
        name: { type: GraphQLString },
        login: { type: GraphQLString },
        watchList: {
            type: new GraphQLList(ArtistWatchType),
            args: {
                first: {
                    type: GraphQLInt,
                    defaultValue: 10
                }
            },
            resolve: ({ userId }, { first }, { viewer }) => ArtistWatch.getByUser(viewer, userId, first)
        },
        reviewList: {
             type: new GraphQLList(AlbumReviewType),
            args: {
                first: {
                    type: GraphQLID,
                    defaultValue: 10
                }
            },
            resolve: ({ userId }, { first }, { viewer }) => AlbumReview.getByUser(viewer, userId, first)
        }
    })
});

export default UserType;