import BaseRepository from "./base-repository";
import { configRepository } from "./config-repository";
import Events from "../models/events";
import { globalEventEmitter } from "../utils/global-event-emitter";
import { projectsRepository } from "./projects-repository";

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class BuildsRepository extends BaseRepository
{
    constructor(enforcer)
    {
        super();

        if (enforcer !== singletonEnforcer)
        {
            throw "Cannot construct singleton!";
        }
    }

    static get instance()
    {
        if (!this[singleton])
        {
            this[singleton] = new BuildsRepository(singletonEnforcer);
        }

        return this[singleton];
    }

    getUpcomingReleases()
    {
        return this.doGet("/releases");
    }
}

export const buildsRepository = BuildsRepository.instance;