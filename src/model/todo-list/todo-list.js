'use strict'

import * as dateFns from 'date-fns';
import { PriorityEnum, TodoItem } from '../todo/todo.js';

export default class TodoList {
    #items
    name

    /**
     * @constructor
     * @param {Object[]} items Items to pre-load the list with
     */
    constructor(name = 'default', items = []) {
        if (!(typeof name === 'string')) throw new Error('Name must be a string.');
        if (name === '') throw new Error('Name cannot be empty.');
        if (!Array.isArray(items)) throw new Error('Argument is not an array of todo items.');
        this.name = name;
        this.#items = items;
    }

    /**
     * 
     * @param {TodoItem} item 
     * @returns {TodoList}
     */
    add(item) {
        this.#items.push(item);
        return this;
    }

    /**
     * 
     * @param {TodoItem|number} item An instance of the item, or a numeric index
     * @returns {TodoList}
     */
    remove(item) {

        function findItemIdx(todoItem) {
            let idx = -1;
            for (let i = 0; i < this.#items.length; i++) {
                if (TodoItem.areSame(todoItem, this.#items[i])) {
                    idx = i;
                    break;
                }
            }
            return idx;
        }

        let itemIdx;
        if (item instanceof TodoList) {
            itemIdx = findItemIdx.call(this, item);
            if (itemIdx < 0) throw new Error(`${item} was not found in list.`);
        } else {
            itemIdx = item;
        }

        this.#items.splice(itemIdx, 1);
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
            return PriorityEnum.compareAsc(a.priority, b.priority);
        });
        return this;
    }

    sortPriorityDesc() {
        this.#items.sort((a, b) => {
            return -1 * PriorityEnum.compareAsc(a.priority, b.priority);
        });
        return this;
    }
}
