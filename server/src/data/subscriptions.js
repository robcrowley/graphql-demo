import { PubSub } from 'graphql-subscriptions';

export const topics = {
   ALBUM_ADDED : "albumAdded",  
};

export const mediator = new PubSub();

export default mediator;