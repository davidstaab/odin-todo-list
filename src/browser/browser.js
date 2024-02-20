'use strict'

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

    function createDialog() {
        const dialogEl = document.createElement('dialog');
        dialogEl.id = 'new-item-dialog';

        // Heading
        const headingEl = document.createElement('h3');
        headingEl.classList.add('dialog-heading');
        headingEl.textContent = 'Create New Item';
        dialogEl.appendChild(headingEl);
        const formEl = document.createElement('form');
        dialogEl.appendChild(formEl);
        
        // 'Title' input
        const titleLabel = document.createElement('label');
        titleLabel.for = 'new-item-title';
        titleLabel.textContent = 'Title';
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.id = 'new-item-title';
        titleInput.name = 'title';
        formEl.appendChild(titleLabel);
        formEl.appendChild(titleInput);

        //TODO: Add remaining labels and inputs to form:
        // priority (radio), deadline (date picker), note (textarea) <-- In that order!

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        formEl.appendChild(submitBtn);
        formEl.addEventListener('submit', handleSubmit);

        document.body.appendChild(dialogEl);
        return dialogEl;
    }

    function handleSubmit(e) {
        if (e.preventDefault) e.preventDefault(); // Prevent HTTP request
        const dialogEl = e.submitter.closest('dialog');
        const formEl = e.submitter.closest('form');
        const inputs = formEl.querySelectorAll('input');

        dialogEl.close();

        let inputVals = [];
        inputs.forEach((elem) => inputVals.push(elem.value));

        formEl.reset();
        cbFn(new NewItemParams(...inputVals)); // Depends on inputs in correct order
    }

    let dialogEl = document.getElementById('new-item-dialog');
    if (!dialogEl) dialogEl = createDialog(cbFn);
    dialogEl.showModal();

}

function displayNewList() {
    // HTML dialog
}

export class NewItemParams {
    title
    priority
    deadline
    note
    
    constructor(title, priority, deadline, note) {
        this.title = title;
        this.priority = priority;
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