export const DEFAULT_LIST_NAME = 'Default';

/**
 * @readonly
 * @enum {number}
 */
export class PriorityEnum {
    static normal = Object.freeze(new PriorityEnum(0));
    static high = Object.freeze(new PriorityEnum(1));
    static highest = Object.freeze(new PriorityEnum(2));
    #value

    static compareAsc(a, b) {
        return a.#value - b.#value;
    }

    constructor(value) {
        this.#value = value;
    }

    get asString() {
        // NB: Depends on a design where the enum values are public properties
        let keys = Object.keys(PriorityEnum);
        for (const key of keys) {
            let that = PriorityEnum[key];
            if (that === this) {
                return key;
            }
        }
        return null;
    }

    get asNumber() { return this.#value };
}

/**
 * Implements a registry for Todo Items. This links the item cards
 * created in UI to the item entries in the model. Item cards should
 * carry their hash as a data attribute so they can be referenced
 * in the registry. On the model side, every time the model is sorted,
 * the registry should be flushed and updated (alongside doing the same
 * in the UI) so that the order of items in the registry mirrors the
 * order of items in the model.
 * 
 * Design note: This is a downside of using the MVP architecture: the
 * Presenter has to maintain state that links the Model's state to the
 * View's state. In MVC the model's state would be directly linked to
 * the view's state (but they wouldn't be as loosely coupled).
 */
export class TodoRegistry {
    #hashes = []

    constructor() {
        this.#hashes = [];
    }

    /**
     * 
     * @param {UI.TodoItemParams} params
     * @returns {Number} Hash of stringified params
     */
    register(params) {
        const str = Object.values(params)
            .reduce((prev, curr) => prev += String(curr), '');
        const hashed = Lib.hash(str);
        if (this.#hashes.includes(hashed)) {
            throw new Error('An exact copy of this item is already registered.');
        }
        this.#hashes.push(hashed);
        return hashed;
    }

    unregister(hash) {
        let idx = this.#hashes.findIndex(val => val === hash);
        if (idx < 0) throw new Error(`${hash} not found in registry.`);
        this.#hashes.splice(idx, 1);
    }

    flush() {
        this.#hashes = [];
    }

    findIdx(hash) {
        return this.#hashes.findIndex(val => val === hash);
    }

    get hashes() { return this.#hashes };
}

/**
 * Generates a 32-bit numeric hash code from the string
 * @returns {Number} hash code
 */
export function hash(str) {
    // https://stackoverflow.com/a/7616484/2539684
    // CC-BY-SA 4.0
    var hash = 0,
      i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }