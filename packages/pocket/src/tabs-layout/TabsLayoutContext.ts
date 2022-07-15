import React, { useContext, useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';

export type TabCloseListener = () => Promise<boolean> | Promise<void> | boolean;

// 单个tab配置
export type TabConfigType = {
  // tabs 的标识符
  key: string;
  // tabs 标题
  title: React.ReactNode;
  content: React.ReactNode;
  params?: unknown;
  onClose?: () => void;
  order?: number;
};

export type TabsLayoutContextType = {
  tabs: TabConfigType[];
  setTabs: (tabs: TabConfigType[]) => void;
  add: (tabConfig: TabConfigType, active?: boolean) => void;
  update: (tabConfig: Partial<TabConfigType> & { key: string }) => void;
  remove: (key: string) => void;
  activeKey: string;
  active: (key: string, force?: boolean) => void;
  setRenderRoot: (dom: HTMLElement | null) => void;
  extraRef?: React.RefObject<HTMLDivElement>;
};

export const TabsLayoutContext = React.createContext<TabsLayoutContextType>({
  tabs: [],
  setTabs: () => {},
  add: () => {},
  update: () => {},
  remove: () => {},
  activeKey: '',
  active: () => {},
  setRenderRoot: () => {},
});

export default TabsLayoutContext;

export type TabConfigContextType = {
  index: number;
  current: TabConfigType | null;
  isActive: boolean;
  active: () => void;
  close: () => void;
  update: (tabConfig: Omit<TabConfigType, 'key'>) => void;
  params: any;
  addCloseListener: (key: TabCloseListener) => void;
  removeCloseListener: (key: TabCloseListener) => void;
};

export const TabConfigContext = React.createContext<TabConfigContextType>({
  index: -1,
  current: null,
  isActive: false,
  active: () => {},
  close: () => {},
  update: () => {},
  params: null,
  addCloseListener: () => {},
  removeCloseListener: () => {},
});

export const useTabCloseListener = (callback: TabCloseListener) => {
  const _callback = useMemoizedFn(callback);
  const { addCloseListener, removeCloseListener } =
    useContext(TabConfigContext);
  useEffect(() => {
    addCloseListener(_callback);
    return () => {
      removeCloseListener(_callback);
    };
  }, []);
};
