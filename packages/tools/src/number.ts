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
