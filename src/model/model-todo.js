'use strict'

import * as safeJS from 'safejslib';
import * as dateFns from 'date-fns';
import * as Lib from '../lib/lib.js';

export default class TodoItem {
    #title = ''
    #priority = Lib.PriorityEnum.normal
    #deadline = ''
    #note = ''
    #changedCb = null;

    static areSame(a, b) {
        if (!(a instanceof TodoItem && b instanceof TodoItem)) {
            throw new Error('Both parameters must be instances of this class.');
        }
        return (
                a.#title === b.#title
            &&  a.#note === b.#note
            &&  a.#priority === b.#priority
            &&  a.#deadline === b.#deadline
        );
    }

    /**
     * Parses object from stored JSON string
     * @param {Object} callbacks
     * @param {Function} callbacks.changed
     * @param {String} json Output of this.stringify()
     * @returns {TodoItem}  Reconstructed object
     */
    static parse(callbacks, json) {
        const object = JSON.parse(json);

        let priority
        switch (object.priority) {
            case 'normal':
                priority = Lib.PriorityEnum.normal;
                break;
            case 'high':
                priority = Lib.PriorityEnum.high;
                break;
            case 'highest':
                priority = Lib.PriorityEnum.highest;
                break;
        }

        let todoItem = new TodoItem(
            object.title,
            priority,
            object.deadline,
            object.note,
        );
        todoItem.changedCb = callbacks.changed;
        return todoItem;
    }

    constructor(
        title,
        priority,
        deadline,
        note = '',
    ) {
        // Go through the setter functions to validate params
        this.title = title;
        this.priority = priority;
        this.deadline = deadline;
        this.note = note;

        return this;
    }

    /**
     * Sets callback function to fire on model state change.
     * Making it a setter guarantees it only fires after object
     * has been constructed.
     * @param {Function} cbFn
     */
    set changedCb(cbFn) {
        this.#changedCb = cbFn;
    }

    /**
     * @param {String} text
     */
    set title(text) { 
        this.#title = text ? safeJS.sanitizeInput(text) : '';
        if (this.#changedCb) this.#changedCb();
    }
    
    get title() { return this.#title; }

    /**
     * @param {String} text
     */
    set note(text) {
        this.#note = text ? safeJS.sanitizeInput(text) : '';
        if (this.#changedCb) this.#changedCb();
    }

    get note() { return this.#note; }

    /**
     * @param {Symbol} value A value from the Priority object
     */
    set priority(value) {
        if (!(value instanceof Lib.PriorityEnum)) throw new TypeError(`${value} is not a PriorityEnum.`);
        this.#priority = value;
        if (this.#changedCb) this.#changedCb();
    }

    get priority() { return this.#priority; }

    /**
     * @param {String} str YYYY-MM-dd
     */
    set deadline(str) {
        // if (!(date instanceof Date)) throw new TypeError(`Date param is of invalid type ${typeof date}`);
        if (!dateFns.isMatch(str, 'yyyy-MM-dd')) throw new Error(`Invalid date string: ${str.toString()}`);
        this.#deadline = str;
        if (this.#changedCb) this.#changedCb();
    }

    get deadline() { return this.#deadline }

    /**
     * @param {String} format Format string according to dateFns NPM module
     */
    formatDeadline(format = 'MM/dd/yy') {
        return dateFns.formatDate(this.#deadline, format);
    }

    /**
     * Flattens object into a JSON string
     * @returns {String} JSON encoded representation of this
     */
    stringify() {
        return JSON.stringify({
            title: this.#title,
            priority: this.#priority.asString,
            deadline: this.#deadline,
            note: this.#note,
        });
    }
}