import { isEmpty } from 'underscore';

export const offset = (page: number, limit: number) =>
  page === 0 ? 0 : (page - 1) * limit;

export const getArrayValue = (array: any[] = [], key: string, index = 0) => {
  return isEmpty(array) ? null : array[index][key];
};
