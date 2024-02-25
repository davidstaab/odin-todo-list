import { PriorityEnum } from "../lib/lib.js";
import * as DateFns from 'date-fns';

/**
 * 
 * @param {string} name Name of the Iconify icon to be used
 * @returns {HTMLElement} Span
 */
export function createIconifyIcon(name) {
    const iconEl = document.createElement('span');
    iconEl.classList.add('iconify');
    iconEl.dataset.icon = name;
    return iconEl;
}


/**
 * Data interface. Converts UI input types to values needed by Presenter layer.
 */
export class TodoItemParams {
    title = ''
    priority = new PriorityEnum
    deadline = ''
    note = ''
    
    /**
     * 
     * @param {String} title 
     * @param {Number} priority 
     * @param {String} deadline 
     * @param {String} note 
     */
    constructor(title, priority, deadline, note) {
        this.title = title;

        switch (priority) {
            case (0):
                this.priority = PriorityEnum.normal;
                break;
            case (1):
                this.priority = PriorityEnum.high;
                break;
            case (2):
                this.priority = PriorityEnum.highest;
                break;
            default:
                throw new RangeError(`${this.priority} cannot be mapped to the enumeration.`);
        }
        
        this.deadline = this.#sanitizeDeadline(deadline);
        this.note = note;
    }

    #sanitizeDeadline(str) {
        const YYYYMMdd = /^(\d{4}-\d{2}-\d{2})/;
        if (!YYYYMMdd.test(str)) {
            throw new Error(`"${str}" does not contain a YYYY-MM-dd substring.`);
        }
        return str.match(YYYYMMdd)[0];
    }

    /**
     * 
     * @param {String} str
     */
    set deadline(str) {
        this.deadline = this.#sanitizeDeadline(str);
    }

    /**
     * This is for UI display. For YYYY-MM-dd format, get 'deadline'.
     * @returns {String} Deadline in MM/dd/yyyy format
     */
    get deadlineDisplay() {
        return DateFns.format(this.deadline, 'MM/dd/yyyy');
    }
}


/**
 * Just a namespace for static attributes and an accessory function
 */
export class PriorityAttrs {

    static normal = {
        style: {
            color: 'white',
            backgroundColor: 'rgb(155, 122, 79)',
        },
        dataIcon: 'mdi-alert-circle-outline',
    }
    static high = {
        style: {
            color: 'white',
            backgroundColor: 'orange',
        },
        dataIcon: 'mdi-triangle-outline',
    }
    static highest = {
        style: {
            color: 'white',
            backgroundColor: 'red',
        },
        dataIcon: 'mdi-alert-circle-outline',
    }

    /**
     * Applies style to priority element of item card
     * @param {HTMLElement} elem 
     * @param {PriorityEnum} priority 
     */
    static applyStyle(elem, priority) {
        switch (priority) {
            case PriorityEnum.normal:
                elem.style.color = PriorityAttrs.normal.style.color;
                elem.style.backgroundColor = PriorityAttrs.normal.style.backgroundColor;
                break;
            case PriorityEnum.high:
                elem.style.color = PriorityAttrs.high.style.color;
                elem.style.backgroundColor = PriorityAttrs.high.style.backgroundColor;
                break;
            case PriorityEnum.highest:
                elem.style.color = PriorityAttrs.highest.style.color;
                elem.style.backgroundColor = PriorityAttrs.highest.style.backgroundColor;
                break;
        }
    }
}