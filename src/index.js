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

import * as Model from './model/model.js';
import * as UI from './browser/browser.js';
import * as Lib from './lib/lib.js';
import * as Store from './store/store.js';
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
    #hashes = []

    constructor() {
        this.#hashes = [];
    }

    /**
     * 
     * @param {UI.TodoItemParams} params
     * @returns {Number} Hash of stringified params
     */
    register(params) {
        const str = Object.values(params)
            .reduce((prev, curr) => prev += String(curr), '');
        const hashed = Lib.hash(str);
        if (this.#hashes.includes(hashed)) {
            throw new Error('An exact copy of this item is already registered.');
        }
        this.#hashes.push(hashed);
        return hashed;
    }

    unregister(hash) {
        let idx = this.#hashes.findIndex(val => val === hash);
        if (idx < 0) throw new Error(`${hash} not found in registry.`);
        this.#hashes.splice(idx, 1);
    }

    flush() {
        this.#hashes = [];
    }

    findIdx(hash) {
        return this.#hashes.findIndex(val => val === hash);
    }

    get hashes() { return this.#hashes };
}

/**
 * 
 * @param {String} title 
 * @param {Lib.PriorityEnum} priority 
 * @param {String} deadline YYYY-MM-dd format
 * @param {String} note 
 */
function addTodoItem(title, priority, deadline, note) {
    const params = new UI.TodoItemParams(title, priority.asNumber, deadline, note);
    const hash = registry.register(params); // Add to Registry
    UI.addItem(hash, params, { remove: handleRemoveItem }); // Add to UI
    let list = listOfLists.getListByName(UI.getSelectedList());
    list.add(new Model.TodoItem(
        params.title,
        params.priority,
        params.deadline,
        params.note,
    )); // Add to Model
}

function removeTodoItem(hash) {
    const idx = registry.findIdx(hash);
    listOfLists.getListByName(UI.getSelectedList()).remove(idx); // Remove from Model
    UI.removeItem(idx); // Remove from UI
    registry.unregister(hash); // Remove from Registry
}

// Convenience functions for DRY principle
const selectUIList = UI.selectList.bind(null, { selected: handleListSelected });
const addUIList = UI.addList.bind(null, { 
    selected: handleListSelected,
    removed: handleListRemoved,
});


////////////
// Callbacks

function handleListCreated(name) {
    const list = new Model.TodoList(name);
    listOfLists.add(list); // Add to Model
    addUIList(name); // Add to UI

    // This fires handleListSelected(), which displays the items
    selectUIList(name); 
}

/**
 * 
 * @param {UI.TodoItemParams} params 
 */
function handleItemCreated(params) {
    addTodoItem(params.title, params.priority, params.deadline, params.note);
}

/**
 * 
 * @param {Number} hash 
 */
function handleRemoveItem(hash) {
    removeTodoItem(hash);
}

function handleListSelected(name) {
    registry.flush();
    let list = listOfLists.getListByName(name); // Read from Model
    let items = list.sortDeadlineAsc().items
        .map((elem) => {
            let params = new UI.TodoItemParams(
                elem.title,
                elem.priority.asNumber,
                elem.deadline,
                elem.note,
                );
            let hash = registry.register(params); // Add to registry
            return {
                hash,
                params,
                callbacks: {
                    remove: handleRemoveItem,
                },
            }
        });
    UI.displayListOfItems(items); // Add (batch) to UI
}

function handleListRemoved(name, wasSelected) {
    listOfLists.remove(name); // Remove from Model
    registry.flush()
    if (wasSelected) selectUIList(Lib.DEFAULT_LIST_NAME);
}


///////
// Init

UI.createListsMenu({ listCreated: handleListCreated });
UI.createItemsMenu({ itemCreated: handleItemCreated });
const registry = new TodoRegistry();

// TODO: Load persisted state, create items and lists from it
const defaultList = new Model.TodoList(Lib.DEFAULT_LIST_NAME);
const listOfLists = new Model.ListList([defaultList]).sortAsc();

for (let list of listOfLists.lists) { 
    addUIList(list.name, { deleteBtn: list.name !== Lib.DEFAULT_LIST_NAME });
}
selectUIList(Lib.DEFAULT_LIST_NAME);

let selectedListName = UI.getSelectedList();
for (let todo of listOfLists.getListByName(selectedListName).items) {
    addTodoItem(todo.title, todo.priority, todo.deadline, todo.note);
}