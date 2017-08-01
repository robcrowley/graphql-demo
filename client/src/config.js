import env from 'dotenv';

/*eslint no-process-env: "0"*/

export const configure = () => {
    env.config({ silent: true });

    const apiRoute = 'http://localhost:3131/graphql';
    const subscriptionsUrl = 'ws://localhost:3131/subscriptions';

    return { apiRoute, subscriptionsUrl };
}

export default configure();