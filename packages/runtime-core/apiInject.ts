import { getCurrentInstance } from "./component";

export function provide(key, value) {
    // 存
    // key value
    const currentInstance: any = getCurrentInstance(); // provide inject必须在setup中使用

    if (currentInstance) {
        let { provides } = currentInstance;
        const parentProvides = currentInstance.parent.provides;

        // init
        if (provides === parentProvides ) {
            provides = currentInstance.provides = Object.create(parentProvides)
        }
        

        provides[key] = value;
    }
}

export function inject(key, defaultValue) {
    // 取
    const currentInstance: any = getCurrentInstance();

    if (currentInstance) {
        const { parent } = currentInstance;

        const parentProviders = parent.provides;

        if (key in parentProviders) {
            return parentProviders[key];
        } else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}