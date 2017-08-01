import { GraphQLEnumType } from 'graphql';

export const AlbumOrderFieldType = new GraphQLEnumType({
    name: 'AlbumOrderField',
    values: {
        ID: {
            description: 'Order albums by id.',
            value: 1
        },
        TITLE: {
            description: 'Order albums by title.',
            value: 2
        },
        LABEL_ID: {
            description: 'Order albums by label id.',
            value: 3
        }
    }
});

export const OrderDirectionType = new GraphQLEnumType({
    name: 'OrderDirection',
    values: {
        ASCENDING: {
            description: 'Specifies an ascending order for a given orderBy argument.',
            value: 1
        },
        DESCENDING: {
            description: 'Specifies an descending order for a given orderBy argument.',
            value: 2
        }
    }
});