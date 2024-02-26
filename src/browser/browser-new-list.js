'use strict'

import { createIconifyIcon } from "./browser-lib.js";

/**
 * 
 * @param {Function} submitCb Callback for the submit action
 * @returns {HTMLElement} Dialog element
 */
export default function createNewListDialog(submitCb) {
    const dialogEl = document.createElement('dialog');
    dialogEl.id = 'new-list-dialog';

    // Heading
    const headingEl = document.createElement('h3');
    headingEl.classList.add('dialog-heading');
    headingEl.textContent = 'Create New List';
    dialogEl.appendChild(headingEl);
    const formEl = document.createElement('form');
    dialogEl.appendChild(formEl);
    
    // 'Title' input
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title';
    titleLabel.htmlFor = 'new-list-title';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.id = 'new-list-title';
    const titleDiv = document.createElement('div');
    titleDiv.appendChild(titleLabel);
    titleDiv.appendChild(titleInput);
    formEl.appendChild(titleDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');
    formEl.appendChild(buttonsDiv);

    // 'Submit' button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    const icon = createIconifyIcon('mdi-playlist-check');
    submitBtn.appendChild(icon);
    buttonsDiv.appendChild(submitBtn);
    formEl.addEventListener('submit', submitCb);

    // 'Cancel' button
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    const icon2 = createIconifyIcon('mdi-cancel');
    cancelBtn.appendChild(icon2);
    cancelBtn.addEventListener('click', () => dialogEl.close());
    buttonsDiv.appendChild(cancelBtn);

    document.body.appendChild(dialogEl);
    return dialogEl;
}