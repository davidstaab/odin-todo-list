import { TodoItemParams, PriorityAttrs, createIconifyIcon } from "./browser-lib.js";

const REMOVE_ICON = 'mdi-close';

/**
 * Creates a new card for a todo item
 * @param {Number} hash A hash provided by the item registry
 * @param {TodoItemParams} params Parameters defining the todo item
 * @param {Object} callbacks
 * @param {Function} callbacks.remove Callback for remove button
 * @returns {HTMLElement} The card
 */
export default function createItemCard(hash, params, callbacks) {
    // Card
    const cardEl = document.createElement('div');
    cardEl.classList.add('item-card');
    cardEl.dataset.hash = hash;

    // Title + Priority
    const titleEl = document.createElement('h2');
    titleEl.classList.add('title');
    let icon = PriorityAttrs[params.priority.asString].dataIcon;
    const priorityEl = createIconifyIcon(icon);
    priorityEl.classList.add('priority');
    PriorityAttrs.applyStyle(priorityEl, params.priority);
    titleEl.textContent = params.title;
    titleEl.prepend(priorityEl);
    cardEl.appendChild(titleEl);

    // Deadline ("Due")
    const deadlineEl = document.createElement('p');
    deadlineEl.classList.add('due');
    const textNode1 = document.createTextNode('Due on ');
    const dateEl = document.createElement('span');
    dateEl.classList.add('date');
    dateEl.textContent = params.deadlineDisplay;
    // TODO: Apply style based on proximity to Date.now()
    deadlineEl.appendChild(textNode1);
    deadlineEl.appendChild(dateEl);
    cardEl.appendChild(deadlineEl);

    // Note
    const noteEl = document.createElement('p');
    noteEl.classList.add('description');
    noteEl.textContent = params.note;
    cardEl.appendChild(noteEl);

    // Buttons
    const buttonsDiv = document.createElement('div');
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    const removeIcon = createIconifyIcon(REMOVE_ICON);
    removeBtn.appendChild(removeIcon);
    removeBtn.addEventListener('click', callbacks.remove);
    buttonsDiv.appendChild(removeBtn);
    cardEl.appendChild(buttonsDiv);

    return cardEl;
}