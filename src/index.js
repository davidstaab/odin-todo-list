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
import * as Storage from './storage/storage.js';


///////
// Utils

/**
 * Adds a todo item to the application state
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
    let todo = new Model.TodoItem(
        params.title,
        params.priority,
        params.deadline,
        params.note,
    );
    todo.changedCb = handleModelChanged;
    list.add(todo); // Add to Model
}

/**
 * Removes a todo item from the application state
 * @param {Number} hash Hash value taken from .item-card
 */
function removeTodoItem(hash) {
    const idx = registry.findIdx(hash);
    listOfLists.getListByName(UI.getSelectedList()).remove(idx); // Remove from Model
    UI.removeItem(idx); // Remove from UI
    registry.unregister(hash); // Remove from Registry
}

/**
 * Creates a new TodoList object
 * @param {String} name 
 * @returns {Model.TodoList}
 */
function createTodolist(name) {
    const list = new Model.TodoList(name);
    list.changedCb = handleModelChanged;
    return list;
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
    const list = createTodolist(name);
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

/**
 * 
 * @param {String} name Name of list
 */
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
    if (wasSelected) selectUIList(Lib.DEFAULT_LIST_NAME);
}

function handleModelChanged() {
    // TODO: Use that gang of 4 pattern to prevent excessive repeated saves
    Storage.save(listOfLists);
}


///////
// Init

UI.createListsMenu({ listCreated: handleListCreated });
UI.createItemsMenu({ itemCreated: handleItemCreated });
const registry = new Lib.TodoRegistry();

let listOfLists;
const restored = Storage.load({ changed: handleModelChanged });
if (restored) {
    listOfLists = restored;
} else {
    const defaultList = createTodolist(Lib.DEFAULT_LIST_NAME);
    listOfLists = new Model.ListList([defaultList]).sortAsc();
}

for (let list of listOfLists.lists) { 
    addUIList(list.name, { deleteBtn: list.name !== Lib.DEFAULT_LIST_NAME });
}

// This populates the items-list via handleListSelected.
selectUIList(Lib.DEFAULT_LIST_NAME);