'use strict'

import ListList from "../model/model-list-list.js";

export function load() {
    // json.parse() --> rebuild Model by constructing objects
}

/**
 * Saves the Model to browser's localStorage
 * @param {ListList} listList List of lists used by the Presenter
 */
export function save(listList) {
    let flatListList = listList.toString();
    localStorage.setItem('TodoLister__ListOfLists', flatListList);
}