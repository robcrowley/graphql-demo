import { 
    GraphQLID,
    GraphQLNonNull,
    GraphQLInterfaceType
} from 'graphql';

import { 
    AlbumType,
    ArtistType,
    LabelType,
    UserType,
    ArtistWatchType
} from '../';

export const NodeType = new GraphQLInterfaceType({
    name: 'Node',
    description: 'An object with an ID.',
    fields: {
        id: { type: GraphQLID }
    },
    resolveType: value => value.title
        ? AlbumType : value.login
        ? UserType : value.founded
        ? LabelType : ArtistType
});

export default NodeType;