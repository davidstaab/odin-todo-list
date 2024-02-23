'use strict'

/**
 * Design notes:
 * This app follows MVP architecture:
 *  Presenter: index.js
 *  View: /browser/
 *  Model: /model/
 */

// Webpack imports
import 'normalize.css'; // npm module, not a file
import './index.css';

import { TodoItem } from './model/todo/todo.js';
import { PriorityEnum } from './lib/lib.js';
import TodoList from './model/todo-list/todo-list.js';
import ListList from './model/list-list/list-list.js';
import * as UI from './browser/browser.js';
import * as UILib from './browser/browser-lib.js';
import * as Lib from './lib/lib.js';
import * as Store from './model/store/store.js';
import * as dateFns from 'date-fns';

///////
// Utils

/**
 * Implements a registry for Todo Items. This links the item cards
 * created in UI to the item entries in the model. Item cards should
 * carry their hash as a data attribute so they can be referenced
 * in the registry. On the model side, every time the model is sorted,
 * the registry should be flushed and updated (alongside doing the same
 * in the UI) so that the order of items in the registry mirrors the
 * order of items in the model.
 * 
 * Design note: This is a downside of using the MVP architecture: the
 * Presenter has to maintain state that links the Model's state to the
 * View's state. In MVC the model's state would be directly linked to
 * the view's state (but they wouldn't be as loosely coupled).
 */
class TodoRegistry {
    #items = []

    constructor() {
        this.#items = [];
    }

    /**
     * 
     * @param {UILib.TodoItemParams} params 
     * @returns {Number} Hash of stringified params
     */
    register(params) {
        const str = Object.values(params)
            .reduce((prev, curr) => prev += String(curr), '');
        const hashed = Lib.hash(str);
        this.#items.push(hashed);
        return hashed;
    }

    unregister(hash) {
        let idx = this.#items.findIndex(val => val === hash);
        if (idx < 0) throw new Error(`${hash} not found in registry.`);
        this.#items.splice(idx, 1);
    }

    findIdx(hash) {
        return this.#items.findIndex(val => val === hash);
    }
}

function load() {

}

function save() {
    // Auto-call this on every change
}

////////////
// Callbacks

function handleNewList(name) {
    console.log(name);
}

/**
 * 
 * @param {UILib.TodoItemParams} params 
 */
function handleNewItem(params) {
    console.dir(params);
    // TODO: Add item to model
    const hash = registry.register(params);
    UI.addItem(hash, params, { remove: handleRemoveItem });
}

/**
 * 
 * @param {Number} hash 
 */
function handleRemoveItem(hash) {
    const idx = registry.findIdx(hash);
    UI.removeItem(idx);
    registry.unregister(hash);
}

///////
// Init

UI.createListsMenu({ newListCb: handleNewList });
UI.createItemsMenu({ newItemCb: handleNewItem });
const registry = new TodoRegistry();
// TODO: Load persisted state