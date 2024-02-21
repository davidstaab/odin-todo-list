'use strict'

import newItemDialog from './browser-new-item.js';

/* Design notes:
 * This module should encapsulate all calls to the browser's APIs.
 *   So DOM calls, event handlers, etc. all stay in here.
 * It can export interface classes and functions to the ViewModel (index).
 *   These form the contract between View and ViewModel.
 */


/**
 * 
 * @param {string} name Name of the Iconify icon to be used
 * @returns {HTMLElement} Span
 */
function createIconifyIcon(name) {
    const iconEl = document.createElement('span');
    iconEl.classList.add('iconify');
    iconEl.dataset.icon = name;
    return iconEl;
}

/**
 * 
 * @param {Function} cbFn Callback for form submit
 */
function displayNewItem(cbFn) {

    function handleSubmit(e) {
        if (e.preventDefault) e.preventDefault(); // Prevent HTTP request
        const dialogEl = e.submitter.closest('dialog');
        const formEl = e.submitter.closest('form');
        dialogEl.close();
        let formData = new FormData(formEl);
        formEl.reset();
        cbFn(new NewItemParams(
            formData.get('title'),
            formData.get('priority'),
            formData.get('deadline'),
            formData.get('note'),
        ));
    }

    let dialogEl = document.getElementById('new-item-dialog');
    if (!dialogEl) dialogEl = newItemDialog(handleSubmit);
    dialogEl.showModal();

}

function displayNewList() {
    // HTML dialog
}

/**
 * Data interface for callback to displayNewItem()
 */
export class NewItemParams {
    title
    priority
    deadline
    note
    
    constructor(title, priority, deadline, note) {
        this.title = title;
        this.priority = priority;
        // new Date(deadline).toISOString() <-- Saving this for later
        // https://stackoverflow.com/questions/948532/how-to-convert-a-date-to-utc
        this.deadline = deadline;
        this.note = note;
    }
}

export function displayListOfItems() {

}

export function displayListOfLists() {

}

export function createMenuBtn(menuName, btnName, iconName, cbFn) {
    const menuDiv = document.querySelector(`.${menuName}-area .menu`);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add(`${btnName}-btn`);
    btn.addEventListener('click', () => displayNewItem(cbFn));
    btn.appendChild(createIconifyIcon(iconName));
    menuDiv.appendChild(btn);
}

export function removeItem() {

}

export function addItem() {

}

export function removeList() {

}

export function addList() {

}