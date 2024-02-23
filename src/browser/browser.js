'use strict'

import createNewItemDialog from './browser-new-item.js';
import createNewListDialog from './browser-new-list.js';
import createItemCard from './browser-item-card.js';
import { NewItemParams, PriorityAttrs, createIconifyIcon } from './browser-lib.js';
import { PriorityEnum } from '../lib/lib.js';
import * as DateFns from "date-fns";

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
        cbFn(new NewItemParams(
            formData.get('title'),
            Number(formData.get('priority')),
            formData.get('deadline'),
            formData.get('note'),
        ));
    }

    let dialogEl = document.getElementById('new-item-dialog');
    if (!dialogEl) dialogEl = createNewItemDialog(handleSubmit);
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

export function removeItem() {

}

/**
 * 
 * @param {NewItemParams} params 
 */
export function addItem(params) {
    const listEl = document.querySelector('.items-list');
    listEl.appendChild(createItemCard(params));
}

export function removeList() {

}

export function addList() {

}