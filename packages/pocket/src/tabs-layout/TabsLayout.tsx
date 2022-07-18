import React, { useContext, useEffect, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import { useMap, useMemoizedFn } from 'ahooks';
import './TabsLayout.less';
import ReactDOM from 'react-dom';
import { Tabs, TabsProps } from 'antd';
import { changeArr, removeArrIndex } from '@orca-fe/tools';
import TabsLayoutContext, {
  TabCloseListener,
  TabConfigContext,
  TabConfigType,
  useTabCloseListener,
} from './TabsLayoutContext';

const px = pc('orca-tabs-layout');

const TabView = (
  props: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
) => {
  const { className = '', ...otherProps } = props;
  const { setRenderRoot } = useContext(TabsLayoutContext);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      setRenderRoot(rootRef.current);
      return () => {
        setRenderRoot(null);
      };
    }
    return undefined;
  }, []);
  return (
    <div
      ref={rootRef}
      className={`${px('view')} ${className}`}
      {...otherProps}
    />
  );
};

export interface TabsLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  emptyContent?: React.ReactElement;
  tabsProps?: TabsProps;
}

const TabsLayout = (props: TabsLayoutProps) => {
  const {
    className = '',
    children = <TabView />,
    emptyContent = null,
    tabsProps,
    ...otherProps
  } = props;

  const [root, setRoot] = useState<HTMLElement | null>(null);

  const [activeKey, setActiveKey] = useState('');

  const [tabs, setTabs] = useState<TabConfigType[]>([]);

  // const [extraContent, setExtraContent] = useState<TabsProps['tabBarExtraContent'] | undefined>(undefined);
  const extraRef = useRef<HTMLDivElement>(null);

  const [, onCloseListenerMap] = useMap<string, Set<TabCloseListener>>([]);

  // 添加 tab
  const add = useMemoizedFn(
    (tabConfig: TabConfigType, active: boolean = true) => {
      setTabs((tabs) => {
        const index = tabs.findIndex(({ key }) => key === tabConfig.key);
        // TODO order
        if (index >= 0) {
          return changeArr(tabs, index, tabConfig);
        }
        return [...tabs, tabConfig];
      });
      if (active || tabs.length === 0) {
        setActiveKey(tabConfig.key);
      }
    },
  );

  // 添加 tab
  const update = useMemoizedFn(
    (tabConfig: Partial<TabConfigType> & { key: string }) => {
      setTabs((tabs) => {
        const index = tabs.findIndex(({ key }) => key === tabConfig.key);
        if (index >= 0) {
          return changeArr(tabs, index, { ...tabs[index], ...tabConfig });
        }
        return tabs;
      });
    },
  );

  // 移除 tab
  const remove = useMemoizedFn(async (_key: string) => {
    const listeners = onCloseListenerMap.get(_key);
    // 检查事件
    if (listeners && listeners.size > 0) {
      for (const listenersKey of listeners) {
        try {
          const res = await listenersKey();
          if (!res) {
            // 禁止关闭
            return;
          }
        } catch (err) {
          // 禁止关闭
          return;
        }
      }
    }
    setTabs((tabs) => {
      const index = tabs.findIndex(({ key }) => key === _key);
      const newTabs = removeArrIndex(tabs, index);
      // 如果删除的是当前选中的 tab，则需要找一个相邻的tab选中
      if (_key === activeKey) {
        const nextIndex = Math.min(tabs.length - 2, Math.max(0, index - 1));
        if (nextIndex >= 0) {
          setActiveKey(newTabs[nextIndex].key);
        } else {
          setActiveKey('');
        }
      }
      return newTabs;
    });
  });

  // 激活 tab
  const active = useMemoizedFn((_key: string, force = false) => {
    if (force || tabs.some(({ key }) => key === _key)) {
      setActiveKey(_key);
    } else {
      console.error(`tab key [${_key}] not exists`);
    }
  });

  const addCloseListener = useMemoizedFn(
    (_key: string, callback: TabCloseListener) => {
      let listenerList = onCloseListenerMap.get(_key);
      if (listenerList == null) {
        listenerList = new Set();
      }
      listenerList.add(callback);
      onCloseListenerMap.set(_key, listenerList);
    },
  );

  const removeCloseListener = useMemoizedFn(
    (_key: string, callback: TabCloseListener) => {
      const listenerList = onCloseListenerMap.get(_key);
      if (listenerList != null) {
        listenerList.delete(callback);
        onCloseListenerMap.set(_key, listenerList);
      }
    },
  );

  return (
    <div className={`${px('root')} ${className}`} {...otherProps}>
      <TabsLayoutContext.Provider
        value={{
          setRenderRoot: setRoot,
          add,
          update,
          remove,
          tabs,
          setTabs,
          active,
          activeKey,
          extraRef,
        }}
      >
        <>
          {children}
          {root &&
            ReactDOM.createPortal(
              tabs.length > 0 ? (
                <Tabs
                  className={px('tab')}
                  type="editable-card"
                  activeKey={activeKey}
                  onChange={setActiveKey}
                  hideAdd
                  onEdit={(tabKey, action) => {
                    if (action === 'remove' && typeof tabKey === 'string') {
                      remove(tabKey);
                    }
                  }}
                  tabBarExtraContent={<div ref={extraRef} />}
                  {...tabsProps}
                >
                  {tabs.map((tabConfig, index) => {
                    const {
                      key,
                      content,
                      title,
                      params,
                      closable = true,
                    } = tabConfig;
                    return (
                      <Tabs.TabPane key={key} tab={title} closable={closable}>
                        <TabConfigContext.Provider
                          value={{
                            active: active.bind(null, key),
                            close: remove.bind(null, key),
                            isActive: activeKey === key,
                            current: tabConfig,
                            update: (config) => {
                              update({ ...config, key });
                            },
                            index,
                            params,
                            addCloseListener: (callback) => {
                              addCloseListener(key, callback);
                            },
                            removeCloseListener: (callback) => {
                              removeCloseListener(key, callback);
                            },
                          }}
                        >
                          {content}
                        </TabConfigContext.Provider>
                      </Tabs.TabPane>
                    );
                  })}
                </Tabs>
              ) : (
                emptyContent
              ),
              root,
            )}
        </>
      </TabsLayoutContext.Provider>
    </div>
  );
};

TabsLayout.View = TabView;

TabsLayout.TabsLayoutContext = TabsLayoutContext;
TabsLayout.TabConfigContext = TabConfigContext;
TabsLayout.useTabCloseListener = useTabCloseListener;

export default TabsLayout;
