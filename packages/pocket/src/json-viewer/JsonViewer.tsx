import React, { useMemo, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import { CaretRightFilled } from '@ant-design/icons';
import JSON5 from 'json5';
import './JsonViewer.less';
import produce from 'immer';
import EditableDiv from '../editable-div';
import OpenBox from '../open-box';

const px = pc('orca-json-viewer');
const eArr = [];
const ef = () => {};

const optimizedArraySplitSize = Symbol('optimizedArraySplitSize');
const optimizedArrayRef = Symbol('optimizedArrayRef');

export type ValueChangeType<T> = {
  value: T;
  path: string[];
  modifiedValue: any;
};

export interface JsonViewerProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: T;
  level?: number;
  path?: string[];
  fieldKey?: string | number;
  suffix?: string;
  comma?: boolean;
  editable?: boolean;
  rootDefaultOpen?: boolean;
  defaultOpen?: number | boolean | ((node: T, path: string[]) => boolean);
  onChange?: (value: T, e: ValueChangeType<T>) => void;
}

const JsonViewer = function <T>(props: JsonViewerProps<T>) {
  const {
    className = '',
    value,
    level = 0,
    path = eArr,
    fieldKey,
    suffix,
    comma,
    onChange = ef,
    rootDefaultOpen,
    defaultOpen,
    editable,
    ...otherProps
  } = props;
  const valueType = typeof value;
  const isNull = value === null;
  const isObject = value != null && valueType === 'object';
  const isArray = Array.isArray(value);
  const length = isArray ? value.length : 0;
  let previewValue = '';
  const [defaultOpenValue] = useState(() => {
    if (!isObject) {
      return false;
    }
    if (rootDefaultOpen) {
      return true;
    }
    if (defaultOpen === true) {
      return true;
    }
    if (typeof defaultOpen === 'number' && level <= defaultOpen) {
      return true;
    }
    if (typeof defaultOpen === 'function') {
      return defaultOpen(value, path);
    }

    return false;
  });
  const [open, setOpen] = useState(defaultOpenValue);
  const [editing, setEditing] = useState(false);
  const openedRef = useRef(open);
  if (open) openedRef.current = true;

  // 优化 value
  const optimizedValue = useMemo(() => {
    if (!openedRef.current) {
      return undefined;
    }
    if (isArray) {
      const optimizedArray: any[] = [];
      const splitSize =
        10 ** (Math.trunc(Math.log10(value.length - 1) / 2) * 2);
      if (!Number.isNaN(splitSize) && splitSize > 1) {
        optimizedArray[optimizedArraySplitSize] = splitSize;
        for (let i = 0; i * splitSize < value.length; i++) {
          const arr = value.slice(i, splitSize);
          arr[optimizedArrayRef] = value[optimizedArrayRef] || value;
          if (arr.length === 1) {
            optimizedArray.push(arr[0]);
          } else {
            optimizedArray.push(arr);
          }
        }
        return optimizedArray;
      }
      return value;
    }
    return value;
  }, [value, openedRef.current]);

  const isOptimized = !!optimizedValue && optimizedValue !== value;

  if (isArray) {
    previewValue = `Array(${length})`;
    if (open) {
      previewValue = '[';
    }
  } else if (isObject) {
    previewValue = '{...}';
    if (open) {
      previewValue = '{';
    }
  } else if (value === undefined) {
    previewValue = 'undefined';
  } else if (value === null) {
    previewValue = 'null';
  } else {
    previewValue = JSON5.stringify(value);
  }
  return (
    <div className={`${px('root')} ${className}`} {...otherProps}>
      <div
        className={px('item')}
        onClick={() => {
          if (isObject) {
            setOpen(!open);
          }
        }}
      >
        {/* 缩进 */}
        <div
          className={px('indent')}
          style={{ width: `${2 * level + (isObject ? 0 : 1)}em` }}
        />
        {/* 下拉箭头 */}
        {isObject && (
          <div className={px('arrow', { 'arrow-open': open })}>
            <CaretRightFilled />
          </div>
        )}
        {/* 如果存在 key，则添加 key */}
        {fieldKey != null && <div className={px('key')}>{fieldKey}</div>}
        {/* value */}
        <EditableDiv
          compact
          value={previewValue}
          editing={editing}
          onEditChange={setEditing}
          onChange={(valueStr) => {
            if (previewValue !== valueStr) {
              let newValue;
              try {
                if (valueStr && valueStr.trim() === 'undefined') {
                  newValue = undefined;
                } else {
                  newValue = JSON5.parse<T>(valueStr);
                }
              } catch (error) {
                // 解析失败
                console.error(error);
                return;
              }
              const e: ValueChangeType<T> = {
                value: newValue,
                modifiedValue: newValue,
                path,
              };
              onChange(newValue, e);
            }
          }}
          className={px('value', `type-${isNull ? 'null' : valueType}`)}
          onDoubleClick={() => {
            if (!isObject && editable && !editing) {
              setEditing(true);
            }
          }}
        />
        {comma && !open && ','}
        {suffix}
      </div>

      {/* children */}
      {isObject && openedRef.current && (
        <OpenBox open={open} defaultHeight={defaultOpenValue ? 'auto' : 0}>
          {!isOptimized &&
            Object.entries(value).map(([key, subValue]) => (
              <JsonViewer
                value={subValue}
                key={key}
                fieldKey={key}
                level={level + 1}
                comma
                editable={editable}
                path={[...path, key]}
                defaultOpen={defaultOpen}
                onChange={(changedValue, e) => {
                  const newValue = produce(value, (_value) => {
                    // eslint-disable-next-line no-param-reassign
                    _value[key] = changedValue;
                  });
                  onChange(newValue, {
                    ...e,
                    value: newValue,
                  });
                }}
              />
            ))}
          <div className={px('item')}>
            <div
              className={px('indent')}
              style={{ width: `${2 * level + 1}em` }}
            />
            {isArray ? ']' : '}'}
          </div>
        </OpenBox>
      )}
    </div>
  );
};

export default JsonViewer;
