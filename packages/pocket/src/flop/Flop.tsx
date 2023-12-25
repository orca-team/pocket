import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CountUp } from 'countup.js';
import type { ConvertOptions, ConvertRule } from '@orca-fe/tools';
import { createCovertUnitFn, createUnitValue } from '@orca-fe/tools';
import { useUpdateEffect } from 'ahooks';
import useStyles from './Flop.style';

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

export interface FlopProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix'> {
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

  /** 起始数值 */
  start?: number;
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
    start = 0,
    ...otherProps
  } = props;
  const styles = useStyles();
  const _value = Number.isNaN(Number(value)) ? 0 : Number(value);

  const convertUnitFn = useMemo(() => {
    const { rules = defaultConvertUnitRules, ...otherConfig } = convertUnit || {};
    return createCovertUnitFn(rules, otherConfig);
  }, [convertUnit]);

  const valueUnit = useMemo(() => {
    if (convertUnit === false) {
      return createUnitValue(_value.toFixed(decimalsMaxLength), '');
    }
    return convertUnitFn(_value.toFixed(decimalsMaxLength));
  }, [_value, convertUnit, convertUnitFn]);

  const countupRef = useRef<HTMLSpanElement>(null);

  const [_this] = useState({
    countup: undefined as CountUp | undefined,
  });

  useEffect(() => {
    const countUpDom = countupRef.current;
    if (countUpDom) {
      if (!_this.countup) {
        _this.countup = new CountUp(countUpDom, valueUnit.value, {
          startVal: start,
          duration,
          separator,
          decimalPlaces: decimals ?? decimalLength(valueUnit.value),
        });
        _this.countup.start();
      }
    }
  }, []);

  useUpdateEffect(() => {
    if (_this.countup?.options) {
      _this.countup.options.duration = duration;
      _this.countup.reset();
    }
  }, [duration]);

  useUpdateEffect(() => {
    if (_this.countup?.options) {
      _this.countup.options.separator = separator;
    }
  }, [separator]);

  useUpdateEffect(() => {
    if (_this.countup) {
      if (_this.countup.options) {
        _this.countup.options.decimalPlaces = decimals ?? decimalLength(valueUnit.value);
      }
      _this.countup.update(valueUnit.value);
    }
  }, [valueUnit]);

  return (
    <span ref={ref} className={`${styles.root} ${className}`} {...otherProps}>
      {prefix}
      <span ref={countupRef} className={styles.countup} style={numStyle} />
      {/* <CountUp
        style={numStyle}
        separator={separator}
        start={0}
        end={valueUnit.value}
        preserveValue
        duration={duration}
        decimals={decimals ?? decimalLength(valueUnit.value)}
      />*/}
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
