import { NewItemParams, PriorityAttrs, createIconifyIcon } from "./browser-lib.js";

/**
 * 
 * @param {NewItemParams} params 
 * @returns 
 */
export default function createItemCard(params) {
    // Card
    const cardEl = document.createElement('div');
    cardEl.classList.add('item-card');

    // Title + Priority
    const titleEl = document.createElement('h2');
    titleEl.classList.add('title');
    let icon = PriorityAttrs[params.priority.toString()].dataIcon;
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
    dateEl.textContent = params.deadline;
    // TODO: Apply style based on proximity to Date.now()
    deadlineEl.appendChild(textNode1);
    deadlineEl.appendChild(dateEl);
    cardEl.appendChild(deadlineEl);

    // Note
    const noteEl = document.createElement('p');
    noteEl.classList.add('description');
    noteEl.textContent = params.note;
    cardEl.appendChild(noteEl);

    return cardEl;
}