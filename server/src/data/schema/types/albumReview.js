import { 
    GraphQLID, 
    GraphQLInt,
    GraphQLString,
    GraphQLNonNull, 
    GraphQLObjectType,
    GraphQLInputObjectType
} from 'graphql';

import { Rating, NodeType, AlbumType, UserType } from './';
import { toGlobalId } from '../../../global';
import { AlbumReview } from '../../../models';

export const AlbumReviewInputType = new GraphQLInputObjectType({
    name: 'AlbumReviewInput',
    fields: {
        albumId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        userId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        content: {
            type: new GraphQLNonNull(GraphQLString)
        },
        rating: {
            type: new GraphQLNonNull(Rating)
        }
    }
});

export const AlbumReviewType = new GraphQLObjectType({
    name: 'AlbumReviewType',
    description: '...',
    interfaces: [NodeType],
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: review => toGlobalId(review, u => u.albumReviewId)
        },
        content: { type: GraphQLString },
        dateCreated: { type: GraphQLString },
        album: {
            type: AlbumType,
            resolve: (review, args, { loaders }) => loaders.album.load(review.albumId)
        },
        user: {
            type: UserType,
            resolve: (review, args, { loaders }) => loaders.user.load(review.userId)
        },
        rating: { type: Rating }
    })
});

export default AlbumReviewType;