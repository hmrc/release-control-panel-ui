import BaseRepository from "./base-repository";
import Events from "../models/events";
import { globalEventEmitter } from "../utils/global-event-emitter";

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class UsersRepository extends BaseRepository
{
    constructor(enforcer)
    {
        super();

        if (enforcer !== singletonEnforcer)
        {
            throw "Cannot construct singleton";
        }

        this.user = null;
    }

    static get instance()
    {
        if (!this[singleton])
        {
            this[singleton] = new UsersRepository(singletonEnforcer);
        }

        return this[singleton];
    }

    changePassword(oldPassword, newPassword)
    {
        const data =
        {
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        return this.doPost("/user/change-password", data);
    }

    createUser(user)
    {
        return this.doPut("/user", user);
    }

    getUser()
    {
        return this.user;
    }

    login(username, password)
    {
        return this.doPost("/auth/login", { username: username, password: password })
            .then(user =>
            {
                this.user = user;

                globalEventEmitter.emit(Events.LOGGED_IN, user);
                globalEventEmitter.emit(Events.PROFILE_LOADED, user);

                return user;
            });
    }

    logout()
    {
        return this.doPost("/auth/logout")
            .then(() =>
            {
                this.user = null;

                globalEventEmitter.emit(Events.LOGGED_OUT);
            });
    }

    getProfile()
    {
        return this.doGet("/user")
            .then(user =>
            {
                this.user = user;

                globalEventEmitter.emit(Events.PROFILE_LOADED, user);

                return user;
            });
    }
    
    updateSettings(settings)
    {
        return this.doPost("/user", settings)
            .then(user =>
            {
                this.user = user;

                globalEventEmitter.emit(Events.PROFILE_LOADED, user);

                return user;
            });
    }
}

export const usersRepository = UsersRepository.instance;