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

    toString() {
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

    toNumber() { return this.#value };
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