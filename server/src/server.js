import 'babel-polyfill'
import db from 'sqlite';
import path from 'path';
import cors from 'cors';
import uuid from 'uuid/v4';
import express from 'express';
import passport from 'passport';
import auth from 'passport-local';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import graphql from 'express-graphql';
import session from 'express-session';
import compression from 'compression';
import memoizers from './data/loaders';
import schema from './data/schema';
import config from './config';
import { User } from './models';
import { createServer } from 'http';
import { graphiqlExpress } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

const LocalStrategy = auth.Strategy;

const formatError = err => ({
    message: err.message,
    locations: err.locations,
    stack: err.stack
});

const graphqlMiddleware = ({ ...options } = {}) => {
    return graphql(async (request, response, params) => {
        const startTime = Date.now();
        const viewer = request.user || { login: 'anonomous', userId: 0 };
        const loaders = memoizers(viewer);
        return {
            schema: schema,
            formatError: formatError,
            context: { loaders, viewer },
            extensions: () => ({ executionTime: Date.now() - startTime }),
            ...options
        };
    });
}

export default graphqlMiddleware;

export const start = () => {
    const app = express();

    const port = config.port;
    const routes = {
        api: config.apiRoute,
        ide: config.ideRoute,
        auth: config.authRoute,
        static: config.staticRoute,
        subscription: config.subscriptionRoute
    };
    const staticPath = path.join(__dirname, 'content');

    app.use(routes.static, express.static(staticPath))
    app.use('*', cors({ origin: `http://localhost:${port}` }));
    app.use(compression());

    app.use(session({
        genid: _ => uuid(),
        secret: '<<l33t>>',
        saveUninitialized: false,
        resave: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(cookieParser());

    app.use(routes.auth, bodyParser.urlencoded({ extended: true }));
    app.post(routes.auth, passport.authenticate('local', {
        successRedirect: routes.ide,
        failureRedirect: routes.auth
    }));

    passport.use('local', new LocalStrategy({ usernameField: 'login' },
        (login, password, done) => User
            .authenticate(login, password)
            .then(user => done(null, user))
            .catch(err => done(err))
    )
    );

    passport.serializeUser((user, done) => {
        console.log(`writing user '${user.login}' to session state`);
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        console.log(`reading user '${user.login}' from session state`);
        done(null, user);
    });

    app.use(routes.api, graphqlMiddleware());
    app.use(routes.ide, graphiqlExpress({
      endpointURL: routes.api,
      subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`  
    }));

    Promise.resolve()
        .then(() => db.open('./artistify.sqlite', { Promise }))
        .then(() => db.driver.on('trace', console.log))
        .then(() => db.migrate({ force: 'last' }))
        .then(() => {
            const ws = createServer(app);
            ws.listen(port, () => {
                new SubscriptionServer(
                    {
                        execute,
                        subscribe,
                        schema,
                        onConnect: (args, ws) => {
                            const viewer = { login: 'ndcconf', userId: 1 };
                            const loaders = memoizers(viewer);
                            return { viewer, loaders }
                        }
                    },
                    {
                        server: ws,
                        path: config.subscriptionRoute
                    }
                );
            });
            console.log(`Listening on ${port}.`);
        })
        .catch(err => console.error(err.stack));
}

if (require.main === module) {
    start();
}