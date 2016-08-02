import t from './type.js';
import check from './check.js';
import getType from './get-type.js';

export default function toRP(RP, sig) {
    const map = {
        array: RP.array,
        bool: RP.bool,
        func: RP.func,
        number: RP.number,
        object: RP.object,
        string: RP.string,
        symbol: RP.symbol,

        any: RP.any,
        arrayOf: RP.arrayOf,
        instanceOf: RP.instanceOf,
        objectOf: RP.objectOf,
        oneOf: RP.oneOf,
        oneOfType: RP.oneOfType,
        shape: RP.shape,
    };

    let reactProptype = null;
    switch(sig.type) {
        case 'objectOf':
        case 'arrayOf':
            reactProptype = map[sig.type](toRP(RP, sig.param));
            break;
        case 'shape': {
            const RPParam = Object.keys(sig.param).reduce((newObj, key) => {
                newObj[key] = toRP(RP, sig.param[key]);
                return newObj;
            }, {});
            reactProptype = RP.shape(RPParam);
            break;
        }
        case 'oneOfType': {
            reactProptype = RP.oneOfType(sig.param.map(item => toRP(RP, item)));
            break;
        }
        case 'oneOf':
        case 'instanceOf':
            reactProptype = map[sig.type](sig.param);
            break;
        default:
            reactProptype = map[sig.type];
    }
    if (sig.optional !== null) {
        reactProptype = reactProptype.isRequired;
    }

    return reactProptype;
}
