import { compareDate1IsOlderOrSame } from "./dateService";

export function hasVisitedToday(){
    const visitData = localStorage.getItem("hasVisited_TJ_Site");

    if(visitData === null)
        return false;

    const lastDate = new Date(visitData);

    return compareDate1IsOlderOrSame(new Date(), lastDate); // if same day then does not do anything, otherwise new day and should return true
}

export function SetVisitForToday(){
    localStorage.setItem("hasVisited_TJ_Site", new Date().toDateString());
}