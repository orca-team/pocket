export class UnitValue {
  unit: string = '';
  value: number = 0;
  times: number = 1;

  get originValue() {
    return this.value * this.times;
  }

  toString() {
    return this.value + this.unit;
  }
}

/**
 * 带单位的数字
 * @param value 数字值
 * @param unit 单位
 * @param times 倍数
 */
export function createUnitValue(
  value: unknown,
  unit: string,
  times = 1,
): UnitValue {
  const uv = new UnitValue();
  uv.value = Number(value) || 0;
  uv.unit = unit || '';
  uv.times = times;
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
 * 根据转换规则，构造一个单位转换函数
 * @param rules 规则
 * @param options 其他配置
 */
export function createCovertUnitFn(
  rules: ConvertRule[],
  options: ConvertOptions = {},
) {
  const { precisionMode = 'auto' } = options;
  return (value, defaultPrecision = 6, defaultUnit = '') => {
    let num = Number(value);
    let lastUnit = defaultUnit;
    let lastPrecision = defaultPrecision;
    let times = 1;
    for (const rule of rules) {
      const { divisor, minValue = divisor, unit, precision = 2 } = rule;
      if (num < minValue) {
        break;
      }
      lastPrecision = precision;
      num /= divisor;
      times *= divisor;
      lastUnit = unit;
    }
    const fixed = Math.floor(
      lastPrecision -
        Math.min(Math.max(0, Math.floor(Math.log10(num))), lastPrecision),
    );
    return createUnitValue(
      num.toFixed(precisionMode === 'auto' ? fixed : lastPrecision),
      lastUnit,
      times,
    );
  };
}
