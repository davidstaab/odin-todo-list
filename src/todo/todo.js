import * as safeJS from 'safejslib';
import * as dateFns from 'date-fns';

export const Priority = Object.freeze({
    normal: Symbol('normal'),
    high: Symbol('high'),
    highest: Symbol('highest'),
});


export class TodoItem {
    #title
    #note
    #priority
    #deadline

    constructor({
        title,
        deadline,
        priority = Priority.normal,
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
        if (!Object.values(Priority).includes(value)) {
            throw new Error(
                `Priority cannot take value ${value.toString()} of type ${typeof value}.`
            );
        }
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