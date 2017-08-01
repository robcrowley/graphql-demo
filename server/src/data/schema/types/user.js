import { toGlobalId } from '../../../global';
import { ArtistWatch } from '../../../models';

import { 
    NodeType, 
    AlbumType, 
    AlbumOrderType, 
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
    description: '...',
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
        }
    })
});

export default UserType;