'use strict'

import { createNewItemDialog, initNewItemDialog } from './browser-new-item.js';
import createNewListDialog from './browser-new-list.js';
import createItemCard from './browser-item-card.js';
import { TodoItemParams, createIconifyIcon } from './browser-lib.js';

const REMOVE_ICON = 'mdi-close';

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

function isListSelected(name) {
    const lists = document.querySelectorAll('.list-card');
    lists.forEach((card) => {
        if (card.dataset.name === name) {
            return card.classList.contains('selected')
        }
    });
    return false;
}

/**
 * 
 * @param {Object} callbacks 
 * @param {Function} callbacks.newItem
 */
export function createItemsMenu(callbacks) {
    const closure = () => displayNewItemDialog(callbacks.newItem);
    createMenuBtn('items', 'new', 'mdi-plus-box-multiple-outline', closure);
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

/**
 * Removes an item (card) from the items list
 * @param {Number} index
 */
export function removeItem(index) {
    Array.from(document.querySelectorAll('.item-card'))[index].remove();
}

/**
 * 
 * @param {Object} callbacks 
 * @param {Function} callbacks.newList
 */
export function createListsMenu(callbacks) {
    const closure = () => displayNewListDialog(callbacks.newList);
    createMenuBtn('lists', 'new', 'mdi-playlist-plus', closure);
}

/**
 * Replaces current item cards with new set of cards
 * @param {Object[]} items
 * @param {Number} items[].hash
 * @param {TodoItemParams} items[].params
 * @param {Object} items[].callbacks
 * @param {Function} items[].callbacks.remove
 */
export function displayListOfItems(items) {
    document.querySelectorAll('.item-card').forEach(item => item.remove());
    items.forEach(item => addItem(item.hash, item.params, item.callbacks));
}

/**
 * 
 * @param {Object} callbacks 
 * @param {Function} callbacks.selected
 * @param {Function} callbacks.removed
 * @param {String} name 
 */
export function addList(callbacks, name) {
    const listsList = document.querySelector('.lists-list');
    const listCard = document.createElement('div');
    listCard.classList.add('list-card');
    listCard.dataset.name = name;
    const titleEl = document.createElement('h2');
    titleEl.textContent = name;
    listCard.appendChild(titleEl);
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    const removeBtnIcon = createIconifyIcon(REMOVE_ICON);
    removeBtn.appendChild(removeBtnIcon);

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeList({ removed: callbacks.removed }, name);
    });
    listCard.appendChild(removeBtn);

    listCard.addEventListener('click', () => {
        selectList({ selected: callbacks.selected }, name);
    });
    listsList.appendChild(listCard);
}

/**
 * 
 * @param {Object} callbacks 
 * @param {Function} callbacks.removed
 * @param {String} name 
 */
export function removeList(callbacks, name) {
    const listCards = document.querySelectorAll('.list-card');

    let index = -1;
    for (let i = 0; i < listCards.length; i++) {
        if (listCards[i].dataset.name === name) {
            index = i;
            break;
        }
    }
    
    if (index < 0) throw new Error(`List name ${name} was not found.`);
    const wasSelected = isListSelected(name);
    listCards[index].remove();
    callbacks.removed(name, wasSelected);
}

/**
 * 
 * @param {Object} callbacks 
 * @param {Function} callbacks.selected
 * @param {String} name 
 */
export function selectList(callbacks, name) {
    const listCards = document.querySelectorAll('.list-card');

    for (let card of listCards) {
        if (card.dataset.name === name) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    }
    callbacks.selected(name);
}