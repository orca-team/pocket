import React, { useContext } from 'react';

export interface EqRatioBoxContextType {
  ratio: number;
}

const EqRatioBoxContext = React.createContext<EqRatioBoxContextType>({
  ratio: 1,
});

export function useRatio() {
  const { ratio } = useContext(EqRatioBoxContext);
  return ratio;
}

export default EqRatioBoxContext;
