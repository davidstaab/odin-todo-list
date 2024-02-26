'use strict'

import TodoList from "./model-todo-list.js";
import * as Lib from '../lib/lib.js';

export default class ListList {
    #lists = []
    #changedCb = null

    /**
     * Parses object from stored JSON string
     * @param {String} json Output of this.stringify()
     * @returns {ListList}  Reconstructed object
     */
    static parse(json) {
        const object = JSON.parse(json);
        
        let lists;
        for (let list of object.items) {
            lists.push(ListList.parse(list));
        }

        return new ListList(lists);
    }

    /**
     * 
     * @param {TodoList[]} lists Array of TodoList
     */
    constructor(lists = []) {
        if (!Array.isArray(lists)) throw new Error('Argument is not an array of todo lists.');
        this.#lists = lists;
        return this;
    }

    /**
     * Sets callback function to fire on model state change.
     * Making it a setter guarantees it only fires after object
     * has been constructed.
     * @param {Function} cbFn
     */
    set changedCb(cbFn) {
        this.#changedCb = cbFn;
    }

    /**
     * @returns {TodoList[]} All TodoLists
     */
    get lists() { return this.#lists; }

    /**
     * 
     * @param {String} name 
     * @returns {TodoList}
     */
    getListByName(name) {
        let index = this.#lists.findIndex((elem) => elem.name === name);
        if (index < 0) return null;
        return this.#lists[index];
    }

    /**
     * 
     * @param {Number} index 
     * @returns {TodoList}
     */
    getListByIndex(index) {
        return this.#lists[index];
    }

    /**
     * 
     * @param {ListList} list 
     * @returns {ListList} this
     */
    add(list) {
        let idx = this.#lists.findIndex((elem) => elem.name === list.name);
        if (idx >= 0) throw new Error(`A list named ${list.name} already exists.`);
        this.#lists.push(list);
        if (this.#changedCb) this.#changedCb();
        return this;
    }

    /**
     * 
     * @param {string|number} list The list name, or a numeric index
     * @returns {ListList} this
     */
    remove(list) {
        let itemIdx;
        if (typeof list === 'string') {
            itemIdx = this.#lists.findIndex((elem) => elem.name === list);
            if (itemIdx < 0) throw new Error(`'${list}' was not found in list of lists.`);
        } else {
            itemIdx = list;
        }

        this.#lists.splice(itemIdx, 1);
        if (this.#changedCb) this.#changedCb();
        return this;
    }

    /**
     * 
     * @returns {ListList} this
     */
    sortAsc(defaultFirst = true) {
        // localeCompare does an alphanumeric sort across worldwide locales
        this.#lists.sort((a, b) => a.title.localeCompare(b.title));

        if (defaultFirst) {
            for (let i = 0; i < this.#lists.length; i++) {
                if (this.#lists[i].name === Lib.DEFAULT_LIST_NAME) {
                    this.#lists.copyWithin(0, i, i);
                    break;
                }
            }
        }

        return this;
    }

    get lists() { return this.#lists; }

    /**
     * Flattens object into a JSON string
     * @returns {String} JSON encoded representation of this
     */
    stringify() {
        let flatLists = [];
        for (let list of this.#lists) {
            let flatList = list.stringify();
            flatLists.push(flatList);
        }
        return JSON.stringify({ lists: flatLists });
    }
}