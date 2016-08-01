import getType from './get-type.js';
import JanusError from './janus-error.js';

const ANONYMOUS = '<<anonymous>>';

const getClassName = (element) => {
    /* istanbul ignore if */
    if (!element.constructor || !element.constructor.name) {
        return ANONYMOUS;
    }
    return element.constructor.name;
}

function validateType(type, element) {
    const elementType = getType(element);
    if (elementType !== type) {
        throw new JanusError({
            type: 'type-error',
            expected: type,
            actual: elementType,
        });
    }

    return true;
}

function isOptional(sig) {
    return sig.optional === null;
}

function anyChecker(element) {
    if (typeof element === 'undefined') {
        throw new JanusError({
            type: 'type-error',
            expected: 'any',
            actual: 'undefined',
        });
    }
}

function arrayOfChecker(element, sig) {
    validateType('array', element);
    const paramSig = sig.param;
    element.forEach((item, index) => {
        const itemError = check(paramSig, item);
        if (itemError !== null) {
            itemError.addPropertyParent(index);
            throw itemError;
        }
    });
}

function instanceOfChecker(element, sig) {
    if (!(element instanceof sig.param)) {
        throw new JanusError({
            type: 'not-instanceof',
            expected: sig.param.name || /* istanbul ignore next */ ANONYMOUS,
            actual: getClassName(element),
        });
    }
}

function objectOfChecker(element, sig) {
    validateType('object', element);
    const paramSig = sig.param;
    Object.keys(element).forEach((key) => {
        const valueError = check(paramSig, element[key]);
        if (valueError !== null) {
            valueError.addPropertyParent(key);
            throw valueError;
        }
    });
}

function oneOfChecker(element, sig) {
    const possibleValues = sig.param;
    for (let i = 0; i < possibleValues.length; i++) {
        if (Object.is(element, possibleValues[i])) {
            return;
        }
    }

    throw new JanusError({
        type: 'not-one-of',
        expected: JSON.stringify(possibleValues),
        actual: element,
    });
}

function oneOfTypeChecker(element, sig) {
    const possibleTypes = sig.param;
    for (let i = 0; i < possibleTypes.length; i++) {
        if (check(possibleTypes[i], element) === null) {
            return;
        }
    }

    throw new JanusError({
        type: 'not-one-of-type',
        expected: JSON.stringify(possibleTypes.map(sig => sig.type)),
        actual: element,
    });
}

function isStrict(sig) {
    return sig.strict === null;
}

function shapeChecker(element, sig) {
    validateType('object', element);
    const shape = sig.param;
    const sigKeys = Object.keys(shape);
    const elementKeys = new Set(Object.keys(element));
    sigKeys.forEach((sigKey) => {
        elementKeys.delete(sigKey);
        const paramSig = shape[sigKey];

        // Ensure required values exist
        if (element[sigKey] === undefined) {
            if (!isOptional(paramSig)) {
                throw new JanusError({
                    type: 'missing-property',
                    property: sigKey,
                    expectedType: paramSig.type,
                });
            } else {
                return;
            }
        }

        // Ensure existing value is of right type
        const paramError = check(paramSig, element[sigKey]);
        if (paramError !== null) {
            paramError.addPropertyParent(sigKey);
            throw paramError;
        }
    });

    // Ensure no extra values are included when strict is set
    if (isStrict(sig) && elementKeys.size > 0) {
        throw new JanusError({
            type: 'extra-property',
            properties: Array.from(elementKeys),
        });
    }
}

const createPrimitiveChecker = (type) => (ele) => validateType(type, ele);

export const primitives = [
    'array',
    'bool',
    'date',
    'func',
    'number',
    'object',
    'regexp',
    'string',
    'symbol',
];

const typeAliases = {
    bool: 'boolean',
    func: 'function',
};

const primitiveCheckers = primitives.reduce((obj, primitive) => {
    const javascriptType = typeAliases[primitive] || primitive;
    obj[primitive] = createPrimitiveChecker(javascriptType);
    return obj;
}, {});

const checkers = {
    ...primitiveCheckers,

    any: anyChecker,
    arrayOf: arrayOfChecker,
    instanceOf: instanceOfChecker,
    // node:
    objectOf: objectOfChecker,
    oneOf: oneOfChecker,
    oneOfType: oneOfTypeChecker,
    shape: shapeChecker,
};

function check(sig, obj) {
    try {
        checkers[sig.type](obj, sig);
        return null;
    } catch (e) {
        return e;
    }
}

export default check;
