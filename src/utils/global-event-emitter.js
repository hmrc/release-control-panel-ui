import { EventEmitter } from "events";

let singleton = Symbol();
let singletonEnforcer = Symbol();

/**
 * Docummentation can be found here: https://nodejs.org/api/events.html
 */
export class GlobalEventEmitter extends EventEmitter
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
            this[singleton] = new GlobalEventEmitter(singletonEnforcer);
        }

        return this[singleton];
    }
}

export const globalEventEmitter = GlobalEventEmitter.instance;