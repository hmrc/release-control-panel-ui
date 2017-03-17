import Events from "../models/events";
import { globalEventEmitter } from "../utils/global-event-emitter";

export default class ErrorHandler
{
    static showErrorMessage(error)
    {
        globalEventEmitter.emit(Events.ERROR_TRIGGERED, error);
    }
}