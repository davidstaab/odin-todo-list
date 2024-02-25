'use strict'

import * as safeJS from 'safejslib';
import * as dateFns from 'date-fns';
import * as Lib from '../lib/lib.js';

export default class TodoItem {
    #title = ''
    #priority = Lib.PriorityEnum.normal
    #deadline = ''
    #note = ''

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
     * @param {String} text
     */
    set title(text) { 
        this.#title = text ? safeJS.sanitizeInput(text) : '';
    }
    
    get title() { return this.#title; }

    /**
     * @param {String} text
     */
    set note(text) {
        this.#note = text ? safeJS.sanitizeInput(text) : '';
    }

    get note() { return this.#note; }

    /**
     * @param {Symbol} value A value from the Priority object
     */
    set priority(value) {
        if (!(value instanceof Lib.PriorityEnum)) throw new TypeError(`${value} is not a PriorityEnum.`);
        this.#priority = value;
    }

    get priority() { return this.#priority; }

    /**
     * @param {String} str YYYY-MM-dd
     */
    set deadline(str) {
        // if (!(date instanceof Date)) throw new TypeError(`Date param is of invalid type ${typeof date}`);
        if (!dateFns.isMatch(str, 'yyyy-MM-dd')) throw new Error(`Invalid date string: ${str.toString()}`);
        this.#deadline = str;
    }

    get deadline() { return this.#deadline }

    /**
     * @param {String} format Format string according to dateFns NPM module
     */
    formatDeadline(format = 'MM/dd/yy') {
        return dateFns.formatDate(this.#deadline, format);
    }
}