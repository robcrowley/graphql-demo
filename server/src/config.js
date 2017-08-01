import env from 'dotenv';

/*eslint no-process-env: "0"*/

export const configure = () => {
    env.config({ silent: true });

    const port = process.env.PORT || 3131;
    const apiRoute = process.env.ARTISTIFY_GRAPHQL_PATH || '/graphql';
    const ideRoute = process.env.ARTISTIFY_GRAPHIQL_PATH || '/graphiql';
    const authRoute = process.env.ARTISTIFY_AUTH_PATH || '/login';
    const staticRoute = process.env.ARTISTIFY_STATIC_PATH || '/public';
    const subscriptionRoute = process.env.ARTISTIFY_GRAPHQL_SUBSCRIPTION_PATH || '/subscriptions';
   
    return { port, apiRoute, ideRoute, authRoute, staticRoute, subscriptionRoute };
}

export default configure();