import BaseRepository from "./base-repository";
import Events from "../models/events";
import { globalEventEmitter } from "../utils/global-event-emitter";

let singleton = Symbol();
let singletonEnforcer = Symbol();

export class StoriesRepository extends BaseRepository
{
    constructor(enforcer)
    {
        super();

        if (enforcer !== singletonEnforcer)
        {
            throw "Cannot construct singleton";
        }
    }

    static get instance()
    {
        if (!this[singleton])
        {
            this[singleton] = new StoriesRepository(singletonEnforcer);
        }

        return this[singleton];
    }

    createReleaseFilter(startReleaseName, endReleaseName)
    {
        const requestUrl = `/releases/create-release-filter?startReleaseName=${startReleaseName}&endReleaseName=${endReleaseName}&timestamp=${+new Date()}`;

        return this.doPost(requestUrl);
    }

    getStoriesForEpic(epicKey)
    {
        return this.doGet(`/stories/for-epic/${epicKey}`);
    }

    refreshStoriesStatuses()
    {
        console.error("StoriesRepository.refreshStoriesStatuses is not implemented!");
        return this.doGet(`/refresh-stories-statuses?timestamp=${+new Date()}`)
            .then(data =>
            {
                globalEventEmitter.emit(Events.TICKETS_UPDATED, data);

                return data;
            });
    }
}

export const storiesRepository = StoriesRepository.instance;