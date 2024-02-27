'use strict'

import * as Model from "../model/model.js";
import * as Lib from "../lib/lib.js";

/**
 * Loads the Model from browser's localStorage
 * @param {Object} callbacks
 * @param {Function} callbacks.changed
 * @returns {Model.ListList} List of lists used by the Presenter
 */
export function load(callbacks) {

    const flatListList = localStorage.getItem('TodoLister__ListOfLists');

    if (flatListList) {
        let listList = null;

        try {
            listList = Model.ListList.parse(callbacks, flatListList);
        } catch (e) {
            console.error(`While loading persisted model: ${e}`);
        }

        if (listList) return listList;
    }

    return null;
}

/**
 * Saves the Model to browser's localStorage
 * @param {Model.ListList} listList List of lists used by the Presenter
 */
export function save(listList) {
    let flatListList = listList.stringify();
    localStorage.setItem('TodoLister__ListOfLists', flatListList);
}