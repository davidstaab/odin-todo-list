'use strict'

import { TodoList } from "../todo-list/todo-list.js";

export default class ListList {
    #lists

    /**
     * 
     * @param {Object[]} lists Array of TodoList
     */
    constructor(lists = []) {
        if (!Array.isArray(lists)) throw new Error('Argument is not an array of todo lists.');
        this.#lists = lists;  
    }

    /**
     * 
     * @param {TodoList} list 
     * @returns {ListList} this
     */
    add(list) {
        index = this.#lists.findIndex((elem) => elem.name === list.name);
        if (index < 0) throw new Error(`A list named ${list.name} already exists.`);
        this.#lists.push(list);
        return this;
    }

    /**
     * 
     * @param {string} listName 
     * @returns {ListList} this
     */
    removeName(listName) {
        let index = this.#lists.findIndex((elem) => elem.name === listName);
        if (index < 0) throw new Error(`'${listName}' was not found in list of lists.`);
        this.#lists.splice(index, 1);
        return this;
    }

    /**
     * 
     * @param {number} index 
     * @returns {ListList} this
     */
    removeIdx(index) {
        this.#lists.splice(index, 1);
        return this;
    }

    /**
     * 
     * @returns {ListList} this
     */
    sortAsc() {
        // localeCompare does an alphanumeric sort across worldwide locales
        this.#lists.sort((a, b) => a.title.localeCompare(b.title));
        return this;
    }

    get lists() { return this.#lists; }
}