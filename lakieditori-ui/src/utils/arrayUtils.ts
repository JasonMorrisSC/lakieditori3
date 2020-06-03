export const toggle = (array: any[], value: any) => {
  if (array.includes(value)) {
    array.splice(array.indexOf(value), 1);
  } else {
    array.push(value);
  }
};

export const splitIfTruthy = (value: string, symbol: any) => {
  return value ? value.split(symbol) : [];
}