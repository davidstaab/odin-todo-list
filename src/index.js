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

import { PriorityEnum, TodoItem} from './model/todo/todo.js';
import TodoList from './model/todo-list/todo-list.js';
import ListList from './model/list-list/list-list.js';
import * as UI from './browser/browser.js';
import * as Store from './model/store/store.js';
import * as dateFns from 'date-fns';

///////
// Utils

function load() {

}

function save() {
    // Auto-call this on every change
}

function createListsMenu() {
    const btns = [
        { name: 'new', icon: 'mdi-playlist-plus' },
    ];

    for (let btn of btns) {
        UI.createMenuBtn('lists', btn.name, btn.icon, handleNewList);
    }
}

// TODO: Move these create() functions into the View
function createItemsMenu() {
    const btns = [
        { name: 'new', icon: 'mdi-plus-box-multiple-outline' },
    ];

    for (let btn of btns) {
        UI.createMenuBtn('items', btn.name, btn.icon, handleNewItem);
    }
}

////////////
// Callbacks

function handleNewList(params) {

}

/**
 * 
 * @param {UI.NewItemParams} params 
 */
function handleNewItem(params) {
    console.dir(params);
}

///////
// Init

createListsMenu();
createItemsMenu();
// Load persisted state