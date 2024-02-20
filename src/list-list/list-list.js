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
        this.#lists.push(list);
        return this;
    }

    /**
     * 
     * @param {TodoList} list 
     * @returns {ListList} this
     */
    remove(list) {

        // BUG: a.name === b.name is false in both implementations.
        // I have no idea why. Even a weak equality (==) fails.

        // let index = this.#lists.findIndex((elem) => elem.name === list.name);

        function findItemIdx(todoList) {
            let idx = -1;
            for (let i = 0; i < this.#lists.length; i++) {
                let a = todoList.name;
                let b = this.lists[i].name;
                if (a == b) {
                    idx = i;
                    break;
                }
            }
            return idx;
        }

        let index = findItemIdx.call(this, list);
        if (index < 0) throw new Error(`'${list}' was not found in list of lists.`);
        this.#lists.splice(index, 1);
        return this;
    }

    sortAsc() {
        // localeCompare does an alphanumeric sort across worldwide locales
        this.#lists.sort((a, b) => a.title.localeCompare(b.title));
        return this;
    }

    get lists() { return this.#lists; }
}