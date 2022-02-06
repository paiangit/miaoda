import React from 'react';
import { Raw } from './types';
import { Select } from 'antd';
import { toNumber } from 'lodash';

type SelectProps = React.ComponentProps<typeof Select>;

interface IdSelectProps
  extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  value: Raw | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 * value可以传入多种类型的值
 * onChange只会回调number | undefined类型
 * 当isNaN(Number(value))为true的时候，代表选择默认类型
 * 当选择默认类型的时候，onChange会回调undefined
 * @param props
 * @constructor
 */
export function IdSelect({
  value,
  onChange,
  defaultOptionName,
  options,
}: IdSelectProps) {
  return (
    <Select
      value={options.length ? toNumber(value) : 0}
      onChange={(value) => onChange(toNumber(value) || undefined)}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : undefined}
    </Select>
  );
}
