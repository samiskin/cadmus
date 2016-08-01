export default class JanusError {
    constructor(data, chain = []) {
        this.data = data;
        this.chain = chain;

        // Error spec
        this.name = 'JanusError';
        this.generateMessage();
        this.stack = (new Error()).stack;
    }

    generateMessage() {
        switch (this.data.type) {
            case 'type-error': {
                const {expected, actual} = this.data;
                this.message = `expected type ${expected}, received ${actual}`;
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
            case 'not-instanceof': {
                const {expected, actual} = this.data;
                this.message = `expected instance of ${expected}, received ${actual}`;
                break;
            }
            case 'not-one-of': {
                const {expected, actual} = this.data;
                this.message = `expected one of ${expected}, received ${actual}`;
                break;
            }
            case 'not-one-of-type': {
                this.message = `expected one of types ${expected}, received ${actual}`;
            }
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
