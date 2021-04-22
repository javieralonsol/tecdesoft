import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue = '') => {
  const value = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : initialValue;

  const [data, newData] = useState(value);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key]);

  return [data, newData];
};
