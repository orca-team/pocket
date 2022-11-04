import React, { useMemo, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import { CaretRightFilled, CopyOutlined } from '@ant-design/icons';
import JSON5 from 'json5';
import './JsonViewer.less';
import produce from 'immer';
import copy from 'copy-to-clipboard';
import EditableDiv from '../editable-div';
import OpenBox from '../open-box';

const px = pc('orca-json-viewer');
const eArr = [];
const ef = () => {};

const optimizedArraySplitSize = Symbol('optimizedArraySplitSize');
const optimizedArrayRef = Symbol('optimizedArrayRef');

type PathType = string | number;
export type ValueChangeType<T> = {
  value: T;
  path: PathType[];
  modifiedValue: any;
};

export interface JsonViewerProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onCopy'> {
  value?: T;
  level?: number;
  path?: PathType[];
  fieldKey?: string | number;
  comma?: boolean;
  editable?: boolean;
  defaultOpen?: number | boolean | ((node: T, path: PathType[]) => boolean);
  onChange?: (value: T, e: ValueChangeType<T>) => void;
  customCopy?: boolean;
  onCopy?: (value: string, path: PathType[]) => void;
  _isRoot?: boolean;
  _optimizedArrayIndex?: number;
  _keyOnly?: boolean;
}

const JsonViewer = function <T>(props: JsonViewerProps<T>) {
  const {
    className = '',
    value,
    level = 0,
    path = eArr,
    fieldKey,
    comma,
    _isRoot = true,
    customCopy,
    onChange = ef,
    onCopy = ef,
    defaultOpen = 0,
    editable,
    _optimizedArrayIndex,
    _keyOnly,
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
          const subArr = value.slice(i * splitSize, i * splitSize + splitSize);
          subArr[optimizedArrayRef] = value[optimizedArrayRef] || value;
          if (subArr.length === 1) {
            optimizedArray.push(subArr[0]);
          } else {
            optimizedArray.push(subArr);
          }
        }
        return optimizedArray;
      }
      return value;
    }
    return value;
  }, [value, openedRef.current]);

  if (isArray) {
    previewValue = `(${length})[...]`;
    if (open) {
      previewValue = `(${length})[`;
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
          style={{
            width: `${1.0 * level + (isObject ? 0 : Math.sign(level))}em`,
          }}
        />
        {/* 下拉箭头 */}
        {isObject && (
          <div className={px('arrow', { 'arrow-open': open })}>
            <CaretRightFilled />
          </div>
        )}
        {/* 如果存在 key，则添加 key */}
        {fieldKey != null && (
          <div className={px('key', { 'key-only': _keyOnly })}>{fieldKey}</div>
        )}

        {!_keyOnly && (
          <>
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
            <div
              className={px('operator')}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <CopyOutlined
                title="复制 value 到剪贴板"
                onClick={() => {
                  const text = isObject
                    ? JSON.stringify(value, null, 2)
                    : String(value);
                  if (!customCopy) {
                    copy(text);
                  }
                  onCopy(text, path);
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* children */}
      {isObject && openedRef.current && optimizedValue && (
        <OpenBox open={open} defaultHeight={defaultOpenValue ? 'auto' : 0}>
          {Object.entries(optimizedValue).map(([key, subValue], index) => {
            const splitSize =
              (optimizedValue[optimizedArraySplitSize] as number) || 1;
            const currentIndexStart =
              (_optimizedArrayIndex || 0) + index * splitSize;
            const isOptimizedSubValue = !!subValue?.[optimizedArrayRef];
            let fieldKey = key;
            let _keyOnly = false;
            if (isOptimizedSubValue) {
              // 子元素也是优化过的数组，将呈现 [0 ... 99] 的形态
              fieldKey = `[${currentIndexStart} ... ${
                currentIndexStart + subValue.length - 1
              }]`;
              _keyOnly = true;
            } else if (isArray && _optimizedArrayIndex != null) {
              fieldKey = `${currentIndexStart}`;
            }

            return (
              <JsonViewer
                _isRoot={false}
                _keyOnly={_keyOnly}
                _optimizedArrayIndex={
                  isOptimizedSubValue ? currentIndexStart : 0
                }
                value={subValue}
                key={key}
                fieldKey={fieldKey}
                level={level + 1}
                comma
                editable={editable}
                path={isOptimizedSubValue ? path : [...path, fieldKey]}
                defaultOpen={defaultOpen}
                onCopy={onCopy}
                onChange={(changedValue, e) => {
                  // 检查是否优化过的项目
                  if (_isRoot) {
                    if (e.path.length > 0) {
                      const newValue = produce(value, (_value) => {
                        let _v = _value;
                        e.path.slice(0, e.path.length - 1).forEach((key) => {
                          _v = _v[key];
                        });
                        const finalKey = e.path[e.path.length - 1];
                        // eslint-disable-next-line no-param-reassign
                        _v[finalKey] = changedValue;
                      });
                      onChange(newValue, {
                        ...e,
                        value: newValue,
                      });
                    }
                  } else {
                    // 非 root，直接透传
                    onChange(changedValue, e);
                  }
                }}
              />
            );
          })}
          <div className={px('item')}>
            <div
              className={px('indent')}
              style={{ width: `${1.0 * level + 1}em` }}
            />
            {isArray ? ']' : '}'}
          </div>
        </OpenBox>
      )}
    </div>
  );
};

export default React.memo(JsonViewer) as typeof JsonViewer;
