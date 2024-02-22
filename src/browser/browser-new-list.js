'use strict'

/**
 * 
 * @param {Function} submitCb Callback for the submit action
 * @returns {HTMLElement} Dialog element
 */
export default function(submitCb) {
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

    // 'Submit' button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    formEl.appendChild(submitBtn);
    formEl.addEventListener('submit', submitCb);

    document.body.appendChild(dialogEl);
    return dialogEl;
}