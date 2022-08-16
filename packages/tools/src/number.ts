export function toFixedNumber(num: any, fractionDigits?: number) {
  if (!Number.isNaN(Number(num))) {
    return Number(Number(num).toFixed(fractionDigits));
  }
  return num;
}

export function decimalLength(value: number): number {
  const str = String(value);
  const pointPosition = str.indexOf('.');
  if (pointPosition < 0) return 0;
  return str.length - pointPosition - 1;
}

export function by(fn: (num: number) => number) {
  return function (divisor: number, offset = 0) {
    const decimalLen = decimalLength(divisor);
    return function (num: number) {
      return toFixedNumber(
        fn((num + offset) / divisor) * divisor - offset,
        decimalLen,
      );
    };
  };
}

export const roundBy = by(Math.round);

export const floorBy = by(Math.floor);

export const ceilBy = by(Math.ceil);

/**
 * 把一个值限制在一个上限和下限之间
 * @param _num 当前数字
 * @param lower 最小值
 * @param upper 最大值
 */
export function clamp(_num: number, lower?: number, upper?: number) {
  let num = _num;
  // eslint-disable-next-line no-self-compare
  if (num === num) {
    if (upper !== undefined) {
      // 如果上限制大于number，则number的值不变，反之，number赋值upper的值
      num = num <= upper ? num : upper;
    }
    if (lower !== undefined) {
      // 同样的，如果下限值小于number，则number值不变，防止，number赋值lower的值
      num = num >= lower ? num : lower;
    }
  }
  return num;
}

export function mix(x: number, y: number, _a: number) {
  const a = clamp(_a, 0, 1);
  return x * (1 - a) + y * a;
}
