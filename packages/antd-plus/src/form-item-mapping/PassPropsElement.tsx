import type { ReactElement } from 'react';
import { cloneElement, createContext, useContext } from 'react';

export const PassPropsContext = createContext<Record<string, any>>({});

type PassPropsElementProps = {
  children?: ReactElement;
  __passPropsNameList?: string[];
  __passPropsRoot?: boolean;
};

// 一個用於傳遞 屬性 的組件，它可以不斷自我嵌套，並將收集到的屬性合併傳遞下去
export const PassPropsElement = (props: PassPropsElementProps & Record<string, any>) => {
  const { children, __passPropsNameList = [], __passPropsRoot, ...otherProps } = props;
  // 從外層組件遞歸獲取的 props
  const propsFromParent = useContext(PassPropsContext);
  // 合併外層組件遞歸獲取的 props 和當前組件的 props
  const currentProps = __passPropsNameList.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: otherProps[cur],
    }),
    __passPropsRoot ? {} : propsFromParent,
  );

  // 繼續遞歸子組件
  return <PassPropsContext.Provider value={currentProps}>{children}</PassPropsContext.Provider>;
};

// 將收集到的組件注入到子組件中
export const PassPropsInject = (props: { children?: ReactElement }) => {
  const { children } = props;
  const propsFromParent = useContext(PassPropsContext);
  return children ? cloneElement(children, propsFromParent) : <>{null}</>;
};
