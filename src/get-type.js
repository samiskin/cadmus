export default (value) => {
    let type = typeof value;
    const custom = {
        array: (v) => Array.isArray(v),
        regexp: (v) => v instanceof RegExp,
        date: (v) => v instanceof Date,
    };

    Object.keys(custom).forEach((t) => {
        if (custom[t](value)) {
            type = t;
        }
    });

    return type;
};

