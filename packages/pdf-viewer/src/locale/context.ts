import { createContext, useContext, useMemo } from 'react';

export type LocaleType = {
  locale?: string;
  loadingTips?: string;
  loadTips?: string;
  autoWidth?: string;
  autoHeight?: string;
  color?: string;
  border?: string;
  paint?: string;
  tooltip?: string;
  inputPlaceHolder?: string;
  fontSize?: string;
  downloadCurrentFile?: string;
  printCurrentFile?: string;
};

export const LocaleContext = createContext<LocaleType | undefined>(undefined);

export const useLocale = (defaultLocale?: LocaleType, locale?: LocaleType) => {
  const parentLocale = useContext(LocaleContext);
  const mergedLocale = useMemo<LocaleType>(() => ({ ...defaultLocale, ...parentLocale, ...locale }), [defaultLocale, parentLocale, locale]);
  return [mergedLocale, mergedLocale.locale] as [LocaleType, string];
};
