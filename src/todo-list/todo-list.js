'use strict'

import * as dateFns from 'date-fns';
import * as todo from '../todo/todo.js';

export class TodoList {
    #items

    /**
     * @constructor
     * @param {Object[]} items Items to pre-load the list with
     */
    constructor(items = []) {
        if (!Array.isArray(items)) throw new Error('Argument is not an array of todo items.');
        this.#items = items;
    }

    /**
     * 
     * @param {todo.TodoItem} item 
     * @returns {TodoList}
     */
    add(item) {
        this.#items.push(item);
        return this;
    }

    /**
     * 
     * @param {todo.TodoItem} item 
     * @returns {TodoList}
     */
    remove(item) {

        function findItemIdx(todoItem) {
            let idx = -1;
            for (let i = 0; i < this.#items.length; i++) {
                if (todo.TodoItem.areSame(todoItem, this.#items[i])) {
                    idx = i;
                    break;
                }
            }
            return idx;
        }
        
        let itemIdx = findItemIdx.call(this, item);
        if (itemIdx < 0) throw new Error(`${item} was not found in list.`);
        this.#items.splice(itemIdx, 1);
        return this;
    }

    removeIdx(index) {
        this.#items.splice(index, 1);
        return this;
    }

    get items() { return this.#items; }

    sortTitleAsc() {
        // localeCompare does an alphanumeric sort across worldwide locales
        this.#items.sort((a, b) => a.title.localeCompare(b.title));
        return this;
    }

    sortDeadlineAsc() {
        this.#items.sort((a, b) => dateFns.compareAsc(a.deadline, b.deadline));
        return this;
    }

    sortPriorityAsc() {
        this.#items.sort((a, b) => {
            return todo.PriorityEnum.compareAsc(a.priority, b.priority);
        });
        return this;
    }

    sortPriorityDesc() {
        this.#items.sort((a, b) => {
            return -1 * todo.PriorityEnum.compareAsc(a.priority, b.priority);
        });
        return this;
    }
}
