import { useEffect } from 'react';

export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};
