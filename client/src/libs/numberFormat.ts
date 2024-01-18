export function numberFormat(num: number): string {
  return new Intl.NumberFormat().format(num)
}
