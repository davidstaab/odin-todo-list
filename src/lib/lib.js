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