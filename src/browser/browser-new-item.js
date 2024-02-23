'use strict'

import * as DateFns from 'date-fns';

/**
 * 
 * @param {Function} submitCb Callback for the submit action
 * @returns {HTMLElement} Dialog element
 */
export default function createNewItemDialog(submitCb) {
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
    titleLabel.textContent = 'Title';
    titleLabel.htmlFor = 'new-item-title';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.id = 'new-item-title';
    const titleDiv = document.createElement('div');
    titleDiv.appendChild(titleLabel);
    titleDiv.appendChild(titleInput);
    formEl.appendChild(titleDiv);

    // 'Priority' input
    const fieldsetEl = document.createElement('fieldset');
    const legendEl = document. createElement('legend');
    legendEl.textContent = 'Priority';
    fieldsetEl.appendChild(legendEl);
    formEl.appendChild(fieldsetEl);

    // TODO: How to decouple this module from the model? Use interface classes
    //   defined in the ViewModel and write abstract code against them? That
    //   creates a circular dependency, though.
    const priorities = [
        { text: 'Normal', value: 0, default: true },
        { text: 'High', value: 1 },
        { text: 'Highest', value: 2 },
    ];

    for (let item of priorities) {
        const radioEl = document.createElement('input');
        radioEl.type = 'radio';
        radioEl.name = 'priority';
        radioEl.id = `new-item-priority-${item.text}`;
        radioEl.value = String(item.value);
        if (item.default) radioEl.checked = item.default;
        fieldsetEl.appendChild(radioEl);
        const radioLabel = document.createElement('label');
        radioLabel.htmlFor = `new-item-priority-${item.text}`;
        radioLabel.textContent = item.text;
        fieldsetEl.appendChild(radioLabel);
    }

    // 'Deadline' input
    const deadlineLabel = document.createElement('label');
    deadlineLabel.htmlFor = 'new-item-deadline';
    deadlineLabel.textContent = 'Deadline';
    const deadlineInput = document.createElement('input');
    deadlineInput.type = 'date';
    deadlineInput.id = 'new-item-deadline';
    deadlineInput.name = 'deadline';
    deadlineInput.value = DateFns.format(new Date(), 'yyyy-MM-dd');
    const deadlineDiv = document.createElement('div');
    deadlineDiv.appendChild(deadlineLabel);
    deadlineDiv.appendChild(deadlineInput);
    formEl.appendChild(deadlineDiv);

    // 'Note' input
    const notelabel = document.createElement('label');
    notelabel.htmlFor = 'new-item-note';
    notelabel.textContent = 'Note';
    const noteInput = document.createElement('textarea');
    noteInput.id = 'new-item-note';
    noteInput.name = 'note';
    const noteDiv = document.createElement('div');
    noteDiv.appendChild(notelabel);
    noteDiv.appendChild(noteInput);
    formEl.appendChild(noteDiv);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');
    formEl.appendChild(buttonsDiv);

    // 'Submit' button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Create';
    buttonsDiv.appendChild(submitBtn);
    formEl.addEventListener('submit', submitCb);

    // 'Cancel' button
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => dialogEl.close());
    buttonsDiv.appendChild(cancelBtn);

    document.body.appendChild(dialogEl);
    return dialogEl;
}