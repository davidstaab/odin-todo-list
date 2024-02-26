'use strict'

import * as dateFns from 'date-fns';
import TodoItem from './model-todo.js';
import { PriorityEnum } from '../lib/lib.js';

export default class TodoList {
    #items = []
    name = ''
    #changedCb = null;

    /**
     * @constructor
     * @param {Object[]} items Items to pre-load the list with
     */
    constructor(name, items = []) {
        if (!(typeof name === 'string')) throw new Error('Name must be a string.');
        if (name === '') throw new Error('Name cannot be empty.');
        if (!Array.isArray(items)) throw new Error('Argument is not an array of todo items.');
        this.name = name;
        this.#items = items;
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
     * 
     * @param {TodoItem} item 
     * @returns {TodoList}
     */
    add(item) {
        this.#items.push(item);
        if (this.#changedCb) this.#changedCb();
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
        if (this.#changedCb) this.#changedCb();
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

    toString() {
        const flatItems = this.#items.reduce(
            (arr, item) => arr.push(item.toString()),
            [],
        );
        return JSON.stringify({
            name: this.name,
            items: flatItems,
        });
    }
}
