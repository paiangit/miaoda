// 给react-query的key加上模块前缀，保证全局唯一
export default function prefixKey(key, moduleName) {
  return `__rq__${moduleName}__${key}`;
}
