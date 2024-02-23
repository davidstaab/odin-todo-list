'use strict'

import { createNewItemDialog, initNewItemDialog } from './browser-new-item.js';
import createNewListDialog from './browser-new-list.js';
import createItemCard from './browser-item-card.js';
import { TodoItemParams, PriorityAttrs, createIconifyIcon } from './browser-lib.js';
import { PriorityEnum } from '../lib/lib.js';
import * as DateFns from "date-fns";
import { TodoItem } from '../model/todo/todo.js';

/* Design notes:
 * This module should encapsulate all calls to the browser's APIs.
 *   So DOM calls, event handlers, etc. all stay in here.
 * It can export interface classes and functions to the ViewModel (index).
 *   These form the contract between View and ViewModel.
 */

function createMenuBtn(menuName, btnName, iconName, cbFn) {
    const menuDiv = document.querySelector(`.${menuName}-area .menu`);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add(`${btnName}-btn`);
    // TODO: This was supposed to be a generic function, but I hard-coded
    //  the displayNewItem function into it. How to make this generic?
    btn.addEventListener('click', cbFn);
    btn.appendChild(createIconifyIcon(iconName));
    menuDiv.appendChild(btn);
}

/**
 * 
 * @param {Function} cbFn Callback for form submit
 */
function displayNewItemDialog(cbFn) {

    function handleSubmit(e) {
        if (e.preventDefault) e.preventDefault(); // Prevent HTTP request
        const dialogEl = e.submitter.closest('dialog');
        const formEl = e.submitter.closest('form');
        dialogEl.close();
        let formData = new FormData(formEl);
        formEl.reset();
        cbFn(new TodoItemParams(
            formData.get('title'),
            Number(formData.get('priority')),
            formData.get('deadline'),
            formData.get('note'),
        ));
    }

    let dialogEl = document.getElementById('new-item-dialog');
    if (!dialogEl) dialogEl = createNewItemDialog(handleSubmit);
    initNewItemDialog();
    dialogEl.showModal();
}

function displayNewListDialog(cbFn) {
    function handleSubmit(e) {
        if (e.preventDefault) e.preventDefault(); // Prevent HTTP request
        const dialogEl = e.submitter.closest('dialog');
        const formEl = e.submitter.closest('form');
        dialogEl.close();
        let formData = new FormData(formEl);
        formEl.reset();
        cbFn(formData.get('title'));
    }

    let dialogEl = document.getElementById('new-list-dialog');
    if (!dialogEl) dialogEl = createNewListDialog(handleSubmit);
    dialogEl.showModal();
}

export function displayListOfItems() {

}

export function displayListOfLists() {

}

export function createItemsMenu({ newItemCb }) {
    const closure = () => displayNewItemDialog(newItemCb);
    createMenuBtn('items', 'new', 'mdi-plus-box-multiple-outline', closure);
}

export function createListsMenu({ newListCb }) {
    const closure = () => displayNewListDialog(newListCb);
    createMenuBtn('lists', 'new', 'mdi-playlist-plus', closure);
}

/**
 * Removes an item (card) from the items list
 * @param {Number} index
 */
export function removeItem(index) {
    Array.from(document.querySelectorAll('.item-card'))[index].remove();
}

/**
 * Adds an item (card) to the items list
 * @param {Number} hash
 * @param {TodoItemParams} params 
 * @param {Object} callbacks
 * @param {Function} callbacks.remove
 */
export function addItem(hash, params, callbacks) {
    const removeClickClosure = (e) => {
        const cardHash = Number(e.target.closest('.item-card').dataset.hash);
        callbacks.remove(cardHash);
    };
    const listEl = document.querySelector('.items-list');
    listEl.appendChild(createItemCard(hash, params, { remove: removeClickClosure }));
}

export function removeList() {

}

export function addList() {

}