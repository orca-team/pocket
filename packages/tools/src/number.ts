export function toFixedNumber(num: any, fractionDigits?: number) {
  if (!Number.isNaN(Number(num))) {
    return Number(Number(num).toFixed(fractionDigits));
  }
  return num;
}
