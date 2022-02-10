import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { cleanObject, subset } from '../utils';

/**
 * 返回页面Url中，指定键的参数值
 */
export const useUrlQueryParams = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    useMemo(
      () =>
        // 下面的Object.forEntries(searchParams)是用来把实现了迭代器的对象，这里是searchParams，里面的键和值读取出来变成一个普通对象
        // 参见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
      // iterator
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
    },
  ] as const; // 这里的as const，即TypeScript中的const断言。const断言会告诉编译器为表达式推断最窄的*或最具体的类型。如果您不使用as const，编译器将使用其默认类型推断行为，这可能会导致更广泛或更通用的类型。
};

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
