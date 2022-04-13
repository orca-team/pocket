// Copy from ahooks
import { useEffect, useLayoutEffect } from 'react';
import createEffectWithTarget from './utils/createEffectWithTarget';

const useEffectWithTarget = createEffectWithTarget(useEffect);
export const useLayoutEffectWithTarget =
  createEffectWithTarget(useLayoutEffect);

export default useEffectWithTarget;
