import bcrypt from 'bcrypt';
import dao from '../data/connectors';

export class User {
    constructor({ userId, name, login } = {}) {
        this.userId = userId;
        this.name = name;
        this.login = login;
    }

    static isAccessibleTo(viewer, { login } = {}) {
        return viewer.login === login;
    }

    static async authenticate(login, password) {
        const data = await dao.getUserByLogin(login);

        if (!data || ! await bcrypt.compare(password, data.password)) {
            throw new Error('invalid username or password');
        }
        return new User(data);
    }

    static async get(viewer, id) {
        const data = await dao.getUser(id);

        return User.isAccessibleTo(viewer, data) ? new User(data) : null;
    }

    static async getByLogin(viewer, login) {
        const data = await dao.getUserByLogin(login);

        return User.isAccessibleTo(viewer, data) ? new User(data) : null;
    }
}

export default User;