export default class JanusError {
    constructor(data = {type: 'generic'}, chain = []) {
        this.data = data;
        this.chain = chain;

        // Error spec
        this.name = 'JanusError';
        this.generateMessage();
        this.stack = (new Error()).stack;
    }

    generateMessage() {
        switch (this.data.type) {

            // Checker errors
            case 'type-error': {
                const {expected, actual} = this.data;
                this.message = `expected ${expected}, received ${actual}`;
                break;
            }
            case 'missing-property': {
                const {property, expectedType} = this.data;
                this.message = `missing required property `
                                + `'${property}' of type ${expectedType}`;
                break;
            }
            case 'extra-property': {
                const {properties} = this.data;
                const plural = properties.length > 1 ? 'ies' : 'y';
                this.message = `unspecified propert${plural}: ${properties.toString()}`;
                break;
            }

            // Proxy errors
            case 'undefined-property': {
                this.message = `access to undefined property ${this.data.propertyName} detected`;
                break;
            }

            default:
                this.message = `error`
        }

        if (this.chain.length > 0) {
            this.message = `${this.chain.join('.')}: ${this.message}`;
        }
    }

    addPropertyParent(property) {
        this.chain = [property, ...this.chain];
        this.generateMessage();
    }
}
