import React, { useMemo } from 'react';
import CountUp from 'react-countup';
import type { ConvertOptions, ConvertRule } from '@orca-fe/tools';
import { createCovertUnitFn, createUnitValue } from '@orca-fe/tools';

function decimalLength(num: number, max = 10) {
  const s = String(num);
  const dot = s.indexOf('.');
  if (dot < 0) {
    return 0;
  }

  return s.length - 1 - dot;
}

const defaultConvertUnitRules: ConvertRule[] = [
  { divisor: 10000, unit: '万' },
  { divisor: 10000, unit: '亿' },
  { divisor: 10000, unit: '万亿' },
];

export interface FlopProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
  value?: number | string;

  /**
   * 翻牌时间
   */
  duration?: number;

  /**
   * 小数位数
   */
  decimals?: number;

  /**
   * 最长小数位数
   */
  decimalsMaxLength?: number;

  prefix?: React.ReactNode;
  suffix?: React.ReactNode | ((additionSuffix: string) => React.ReactNode);
  suffixProps?: React.HTMLAttributes<HTMLDivElement>;

  /**
   * 翻牌数字样式
   */
  numStyle?: React.CSSProperties;

  /**
   * 是否开启千位分隔符
   */
  separator?: string;

  /**
   * 自动换算单位
   */
  convertUnit?:
    | false
    | (ConvertOptions & {
        rules?: ConvertRule[];
      });
}

const Flop = React.forwardRef<HTMLSpanElement, FlopProps>((props, ref) => {
  const {
    value = 0,
    duration = 2,
    separator = ',',
    numStyle = {},
    decimals,
    className = '',
    prefix,
    suffix,
    suffixProps,
    convertUnit,
    decimalsMaxLength = 4,
    ...otherProps
  } = props;
  const _value = Number.isNaN(Number(value)) ? 0 : Number(value);

  const convertUnitFn = useMemo(() => {
    const { rules = defaultConvertUnitRules, ...otherConfig } =
      convertUnit || {};
    return createCovertUnitFn(rules, otherConfig);
  }, [convertUnit]);

  const valueUnit = useMemo(() => {
    if (convertUnit === false) {
      return createUnitValue(_value.toFixed(decimalsMaxLength), '');
    }
    return convertUnitFn(_value.toFixed(decimalsMaxLength));
  }, [_value, convertUnit, convertUnitFn]);

  return (
    <span ref={ref} className={`flop-root ${className}`} {...otherProps}>
      {prefix}
      <CountUp
        style={numStyle}
        separator={separator}
        start={0}
        end={valueUnit.value}
        preserveValue
        duration={duration}
        decimals={decimals ?? decimalLength(valueUnit.value)}
      />
      {typeof suffix === 'function' ? (
        suffix(valueUnit.unit)
      ) : (
        <span {...suffixProps}>
          {valueUnit.unit}
          {suffix}
        </span>
      )}
    </span>
  );
});

export default Flop;
