import { Kind } from 'graphql/language';
import { GraphQLError, GraphQLScalarType } from 'graphql';

const parseToInt = value => {
    try {
        return parseInt(value)
    } catch (e) {
        throw new GraphQLError('Query error: ' + e.message)
    }
}

export const RatingType = new GraphQLScalarType({
    name: 'Rating',
    description: '...',
    serialize: value => value, // identity function for now...
    parseValue: value => parseToInt(value),
    parseLiteral : ast => {
        const rating = parseToInt(ast.value);
        if (rating <= 0 || rating > 10) {
            throw new GraphQLError(`Query error: rating value must be between 1 and 10 but got: ${rating}`);
        }
        return rating;
    }
});

export default RatingType;