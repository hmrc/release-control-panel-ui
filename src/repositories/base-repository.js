import config from "../config";
import Events from "../models/events";
import { globalEventEmitter } from "../utils/global-event-emitter";

export default class BaseRepository
{
    constructor()
    {
        this.baseUrl = config.apiURL;
    }

    doDelete(url, data)
    {
        const request = new Request(this.baseUrl + url,
        {
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
            headers: new Headers({ "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }),
            method: "DELETE",
            mode: "cors"
        });

        return fetch(request).then(BaseRepository.processFetchResponse);
    }

    doGet(url)
    {
        const request = new Request(this.baseUrl + url,
        {
            credentials: "include",
            headers: new Headers({ "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }),
            method: "GET",
            mode: "cors"
        });

        return fetch(request).then(BaseRepository.processFetchResponse);
    }

    doPost(url, data)
    {
        const request = new Request(this.baseUrl + url,
        {
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
            headers: new Headers({ "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }),
            method: "POST",
            mode: "cors"
        });

        return fetch(request).then(BaseRepository.processFetchResponse);
    }

    doPut(url, data)
    {
        const request = new Request(this.baseUrl + url,
        {
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
            headers: new Headers({ "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }),
            method: "PUT",
            mode: "cors"
        });

        return fetch(request).then(BaseRepository.processFetchResponse);
    }

    static processFetchResponse(response)
    {
        var responseJson = response.json().catch(() => { return null });

        if (response.status >= 200 && response.status <= 399)
        {
            return responseJson;
        }

        if (response.status === 401)
        {
            globalEventEmitter.emit(Events.LOGGED_OUT);
        }

        return Promise.reject(responseJson);
    }
}