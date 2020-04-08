export const currentIsoDate = (): string => {
  return new Date().toISOString().substring(0, 10);
};

export const currentTimestamp = (): string => {
  return Date.now().toString(10);
};

export const currentYear = (): number => {
  return new Date().getFullYear();
};

export const toFiDateString = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString('fi-FI');
};

export const toFiDateTimeStringInUtc = (isoDate: string) => {
  return isoDate ? new Date(isoDate).toLocaleString("fi-FI", {timeZone: "UTC"}) : isoDate;
};
