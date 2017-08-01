import 'babel-polyfill'
import chalk from 'chalk';
import gql from 'graphql-tag';
import config from './config';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import WebSocket from 'ws'

export const start = () => {
    const networkInterface = createNetworkInterface({
        uri: config.apiRoute,
        opts: {
            credentials: 'same-origin',
        },
    });

    const subscriptionClient = new SubscriptionClient(
        config.subscriptionsUrl,
        {
            reconnect: true,
            connectionCallback: (err) => {
                if (err) {
                    console.error(chalk.red(err));
                }
            }
        },
        WebSocket);

    const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
        networkInterface,
        subscriptionClient
    );

    const client = new ApolloClient({
        networkInterface: networkInterfaceWithSubscriptions
    });

    const observerable = client.subscribe({
        query: gql`
            subscription onAlbumAdded($userId: ID!) {
                albumAdded(userId: $userId) {
                    artist {
                        id
                        name
                        label {
                            name
                            founded
                        }
                    }
                    album {
                        id
                        title
                    }
                }
            }`,
        operationName: 'albumAdded',
        variables: { userId: 1 }
    });

    observerable.subscribe({
        next: (data) => console.log(chalk.green(JSON.stringify(data))),

        error: (err) => console.error(chalk.red('err', JSON.stringify(err)))
    });

    (function wait() { setTimeout(wait, 5000) })();
}

if (require.main === module) {
    start();
}