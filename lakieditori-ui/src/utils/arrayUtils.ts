export const toggle = (array: any[], value: any) => {
  if (array.includes(value)) {
    array.splice(array.indexOf(value), 1);
  } else {
    array.push(value);
  }
};
