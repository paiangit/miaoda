// 给react-query的key加上模块前缀，保证全局唯一
export const prefixKey = (key, moduleName) => `__rq__${moduleName}__${key}`;
