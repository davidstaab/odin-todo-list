'use strict'

import * as safeJS from 'safejslib';
import * as dateFns from 'date-fns';
import { PriorityEnum } from '../lib/lib.js';

export default class TodoItem {
    #title
    #note
    #priority
    #deadline

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

    constructor({
        title,
        deadline,
        priority = PriorityEnum.normal,
        note = '',
    }) {
        // Go through the setter functions to validate params
        this.title = title;
        this.deadline = deadline;
        this.priority = priority;
        this.note = note;
    }

    /**
     * @param {String} text
     */
    set title(text) { this.#title = safeJS.sanitizeInput(text) }
    
    get title() { return this.#title; }

    /**
     * @param {String} text
     */
    set note(text) { this.#note = safeJS.sanitizeInput(text) }

    get note() { return this.#note; }

    /**
     * @param {Symbol} value A value from the Priority object
     */
    set priority(value) {
        if (!(value instanceof PriorityEnum)) throw new TypeError(`${value} is not a PriorityEnum.`);
        this.#priority = value;
    }

    get priority() { return this.#priority; }

    /**
     * @param {Date} date A Date object, used only with a level of precision of days (not hr/min/s)
     */
    set deadline(date) {
        if (!(date instanceof Date)) throw new TypeError(`Date param is of invalid type ${typeof date}`);
        if (!dateFns.isValid(date)) throw new Error(`Invalid date value: ${date.toString()}`);
        this.#deadline = date;
    }

    get deadline() { return this.#deadline }

    /**
     * @param {String} format Format string according to dateFns NPM module
     */
    formatDeadline(format = 'MM/dd/yy') {
        return dateFns.formatDate(this.#deadline, format);
    }
}