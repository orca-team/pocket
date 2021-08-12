import { useRef } from 'react';

const useThis = <T>(initialObj: T) => useRef<T>(initialObj).current;

export default useThis;
