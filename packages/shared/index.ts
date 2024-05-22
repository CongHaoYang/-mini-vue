export const extend = Object.assign;

export const isObject = (val) => {
    return val !== null && typeof val === "object";
}

export const hasChanged = (val, newVal) => {
    return !Object.is(val, newVal);
}

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);


export const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    })
}

export const captitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}  

export const toHandlerKey = (str) => {
    return str ? "on" + captitalize(camelize(str)) : "";
}