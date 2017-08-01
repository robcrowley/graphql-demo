import DataLoader from 'dataloader';

import {
    Label,
    Artist,
    Album,
    User
} from '../models';

const createLoaders = viewer => {
    const labelLoader = new DataLoader(ids => Label.get(viewer, ids));

    const artistLoader = new DataLoader(ids => Artist.get(viewer, ids));

    const artistWatchLoader = new DataLoader(ids => ArtistWatch.get(viewer, ids));

    const albumLoader = new DataLoader(ids => Album.get(viewer, ids));

    const userLoader = new DataLoader(ids =>
        Promise.all(ids.map(id => User
            .get(viewer, id)
            .then(user => {
                if (user) {
                    userByLoginLoader.prime(user.login, user);
                }
                return user;
            }))
        )
    );

    const userByLoginLoader = new DataLoader(logins =>
        Promise.all(logins.map(login => User
            .getByLogin(viewer, login)
            .then(user => {
                if (user) {
                    userLoader.prime(user.id, user);
                }
                return user;
            }))
        )
    );

    return {
        label: labelLoader,
        artist: artistLoader,
        artistWatch: artistWatchLoader,
        album: albumLoader,
        user: userLoader,
        userByLogin: userByLoginLoader
    };
}

export default createLoaders;