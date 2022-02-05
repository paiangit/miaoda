import { useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { cleanObject } from '../utils';

/**
 * 返回Url中指定键的参数值
 */
export function useUrlQueryParams<T extends string>(keys: T[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  return [
    useMemo(
      () =>
        keys.reduce((accumulator, currentValue) => {
          return {
            ...accumulator,
            [currentValue]: searchParams.get(currentValue),
          };
        }, {} as { [key in string]: string }),
      [searchParams]
    ),
    (params: Partial<{ [key in T]: unknown }>) => {
      // 下面的Object.forEntries(searchParams)是用来把实现了迭代器的对象，这里是searchParams，里面的键和值读取出来变成一个普通对象
      // 参见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      return setSearchParams(o);
    },
  ] as const; // 这里的as const，即TypeScript中的const断言。const断言会告诉编译器为表达式推断最窄的*或最具体的类型。如果您不使用as const，编译器将使用其默认类型推断行为，这可能会导致更广泛或更通用的类型。
}
