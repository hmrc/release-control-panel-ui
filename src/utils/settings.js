import SearchFlags from "../models/search-flags";

export default class Settings
{
    static getSearchFlags()
    {
        let savedSearchFlags = localStorage.getItem("search-flags");
        if (savedSearchFlags)
        {
            return parseInt(savedSearchFlags);
        }

        return SearchFlags.ShowAll;
    }

    static saveSearchFlags(searchFlags)
    {
        localStorage.setItem("search-flags", searchFlags.toString());
    }
}