import isEmpty from './isEmpty';

export default function cleanObject(object?: { [key: string]: unknown }) {
  if (!object) {
    return {};
  }

  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isEmpty(value)) {
      delete result[key];
    }
  });

  return result;
};
