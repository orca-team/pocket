/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useDebugValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Classes, Styles, StyleSheetFactoryOptions, Plugin } from 'jss';
import { create, getDynamicStyles } from 'jss';
import preset from 'jss-preset-default';
import isBrowser from 'is-in-browser';

import { getManager, manageSheet, unmanageSheet } from './manager';

const isSSR = !isBrowser;

interface BaseOptions extends StyleSheetFactoryOptions {
  index?: number;
}

interface CreateUseStylesOptions extends BaseOptions {
  name?: string;
  plugins?: Plugin[];
}

const useIsomorphicEffect = isSSR
  ? React.useInsertionEffect || useLayoutEffect
  : useEffect;

let index = 0;
const getSheetIndex = () => index++;

function mergeClasses<T extends Classes>(sheet: T, dynamic?: T) {
  const classes: T = { ...sheet };
  if (!dynamic) {
    return sheet;
  }
  for (const dynamicKey in dynamic) {
    if (dynamicKey in sheet) {
      // @ts-expect-error
      classes[dynamicKey] += ` ${dynamic[dynamicKey]}`;
    } else {
      // @ts-expect-error
      classes[dynamicKey] = ` ${dynamic[dynamicKey]}`;
    }
  }
  return classes;
}

export default function createUseStyles<C extends string = string, Props = any>(
  styles: Styles<C, Props>,
  options: CreateUseStylesOptions = {},
): (data?: Props) => Classes<C> {
  const { index = getSheetIndex(), name = '', plugins = [] } = options;

  const key = {};

  const jss = create(preset());
  jss.use(...plugins);

  const dynamicStyles = getDynamicStyles(styles as Styles);
  const sheet = jss.createStyleSheet(styles, {
    index,
    meta: `${name ? `${name}-` : ''}-jss-default`,
    link: false,
  });

  return function useStyles(data?: Props) {
    const isFirstMount = useRef(true);

    const [dynamicKey] = useState({});

    useMemo(() => {
      const manager = getManager(index);
      const existingSheet = manager.get(key);

      if (existingSheet) {
        return [];
      }
      manager.add(key, sheet);

      if (sheet && isSSR) {
        // manage immediately during SSRs. browsers will manage the sheet through useInsertionEffect below
        manageSheet(key, {
          index,
          sheet,
        });
      }

      return [];
    }, []);

    const dynamicSheet = useMemo(() => {
      if (!dynamicStyles) return null;
      const dynamicSheet = jss.createStyleSheet(dynamicStyles, {
        index,
        meta: `${name ? `${name}-` : ''}-jss-dynamic`,
        link: true,
      });

      const manager = getManager(index);
      manager.add(dynamicKey, dynamicSheet);
      if (dynamicSheet && isSSR) {
        // manage immediately during SSRs. browsers will manage the sheet through useInsertionEffect below
        manageSheet(dynamicKey, {
          index,
          sheet: dynamicSheet,
        });
      }
      return dynamicSheet;
    }, []);

    useIsomorphicEffect(() => {
      // We only need to update the rules on a subsequent update and not in the first mount
      // if (sheet && dynamicRules && !isFirstMount.current) {
      //   updateDynamicRules(data, sheet, dynamicRules);
      // }
      if (dynamicSheet && data) {
        dynamicSheet.update(data);
      }
    }, [data, dynamicSheet]);

    useIsomorphicEffect(() => {
      if (sheet) {
        manageSheet(key, {
          index,
          sheet,
        });
      }
      if (dynamicSheet) {
        manageSheet(dynamicKey, {
          index,
          sheet: dynamicSheet,
        });
      }

      return () => {
        if (sheet) {
          unmanageSheet(key, {
            index,
            sheet,
          });
        }
        if (dynamicSheet) {
          unmanageSheet(dynamicKey, {
            index,
            sheet: dynamicSheet,
          });
        }
      };
    }, []);

    const classes = useMemo<Classes<C>>(
      () => mergeClasses(sheet.classes, dynamicSheet?.classes),
      [sheet, dynamicSheet],
    );

    useDebugValue(classes);

    useEffect(() => {
      isFirstMount.current = false;
    });

    return classes;
  };
}
