export const isBlank = (str: null | undefined | string) => {
  return (!str || /^\s*$/.test(str));
};
