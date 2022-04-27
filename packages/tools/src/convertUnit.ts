export class UnitValue {
  unit: string = '';
  strValue: string = '0';
  value: number = 0;
  originValue: number = 0;

  toString() {
    return this.strValue + this.unit;
  }
}

/**
 * 带单位的数字
 * @param value 数字值
 * @param unit 单位
 * @param times 倍数
 */
export function createUnitValue(
  value: string | number,
  unit: string,
  originValue?: number,
): UnitValue {
  const uv = new UnitValue();
  uv.value = Number(value) || 0;
  uv.strValue = String(value);
  uv.unit = unit || '';
  uv.originValue = originValue ?? uv.value;
  return uv;
}

export type ConvertRule = {
  // 除数
  divisor: number;
  // 单位
  unit: string;
  // 最小值 默认和 除数 相等，可调整，达到该值后，则进行单位换算
  minValue?: number;
  // 精度（小数位数）
  precision?: number;
};

export type ConvertOptions = {
  // 精度计算的方式 自动/固定 自动模式下，如果数变大，会自动减少小数位数
  precisionMode?: 'auto' | 'fixed';
};

/**
 * 根据精度，计算出 num 需要保留的小数位数
 * @param num 数本身
 * @param precision 精度
 */
function getDecimalLengthByPrecision(num: number, precision?: number) {
  const numStr = String(num);
  const dotIndex = numStr.indexOf('.');
  if (dotIndex < 0) {
    return 0;
  }
  // 计算得出小数的长度
  const decimalLength = numStr.length - 1 - dotIndex;

  if (precision === undefined) {
    return decimalLength;
  }

  // 在给出了精度的情况下，计算出整数部分的位数
  const intLength = Math.floor(Math.log10(num));

  // 计算得出剩余给小数部分的精度
  const p = precision - Math.min(Math.max(0, intLength), precision);
  // 剩余精度不能超过小数位数
  return Math.min(decimalLength, p);
}

/**
 * 根据转换规则，构造一个单位转换函数
 * @param rules 规则
 * @param options 其他配置
 */
export function createCovertUnitFn(
  rules: ConvertRule[],
  options: ConvertOptions = {},
) {
  const { precisionMode = 'auto' } = options;
  return (value, defaultPrecision?: number, defaultUnit = '') => {
    let num = Number(value);
    let lastUnit = defaultUnit;
    let lastPrecision = defaultPrecision;
    for (const rule of rules) {
      const { divisor, minValue = divisor, unit, precision = 2 } = rule;
      if (num < minValue) {
        break;
      }
      lastPrecision = precision;
      num /= divisor;
      lastUnit = unit;
    }
    const fixed = getDecimalLengthByPrecision(num, lastPrecision);

    return createUnitValue(
      num.toFixed(precisionMode === 'auto' ? fixed : lastPrecision),
      lastUnit,
      Number(value),
    );
  };
}

export const chineseUnit = createCovertUnitFn([
  { divisor: 10000, unit: '万' },
  { divisor: 10000, unit: '亿' },
  { divisor: 10000, unit: '万亿' },
]);

export const byteUnit = createCovertUnitFn([
  { divisor: 1024, unit: 'K', minValue: 1000 },
  { divisor: 1024, unit: 'M', minValue: 1000 },
  { divisor: 1024, unit: 'G', minValue: 1000 },
  { divisor: 1024, unit: 'T', minValue: 1000 },
  { divisor: 1024, unit: 'P', minValue: 1000 },
  { divisor: 1024, unit: 'E', minValue: 1000 },
  { divisor: 1024, unit: 'Z', minValue: 1000 },
  { divisor: 1024, unit: 'Y', minValue: 1000 },
  { divisor: 1024, unit: 'B', minValue: 1000 },
  { divisor: 1024, unit: 'N', minValue: 1000 },
  { divisor: 1024, unit: 'D', minValue: 1000 },
  { divisor: 1024, unit: 'C', minValue: 1000 },
  { divisor: 1024, unit: 'X', minValue: 1000 },
]);
