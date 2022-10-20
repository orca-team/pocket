import React, { useState } from 'react';
import pc from 'prefix-classnames';
import './JsonSchemaEditor.less';
import { useControllableValue, useMemoizedFn } from 'ahooks';
import {
  CaretRightFilled,
  CloseOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Checkbox, Dropdown, Menu, Select, Tooltip } from 'antd';
import { insertArr, removeArrIndex } from '@orca-fe/tools';
import DraggableList from './DraggableListNoKey';
import IconButton from './IconButton';
import { defaultValueFromJsonSchema, toTypeScriptDefinition } from './utils';
import { BaseType, JsonValueType } from './defs';
import UcInput from '../uc-input/UcInput';
import OpenBox from '../open-box/OpenBox';

export type { JsonValueType };

const px = pc('json-schema-editor');

const ef = () => {};

const jsonValueTypes = [
  'number',
  'string',
  'boolean',
  'null',
  'object',
  'array',
];

export interface JsonSchemaItemProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {
  defaultValue?: JsonValueType;
  value?: JsonValueType;
  onChange?: (value: JsonValueType) => void;
  level?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  draggable?: boolean;
  onDrag?: (e: React.DragEvent) => void;
  addSiblings?: boolean;
  onAddChild?: () => void;
  onAddSiblings?: () => void;
  onDelete?: () => void;
  nameDisabled?: boolean;
  defaultValueDisabled?: boolean;
  root?: boolean;
}

const JsonSchemaItem = (props: JsonSchemaItemProps) => {
  const {
    open,
    onOpenChange = ef,
    defaultValue,
    value: nouse,
    onChange,
    level = 0,
    draggable = false,
    onDrag = ef,
    onAddChild = ef,
    onAddSiblings = ef,
    nameDisabled,
    defaultValueDisabled,
    root,
    onDelete = ef,
    addSiblings,
    ...otherProps
  } = props;
  const [value = {} as JsonValueType, setValue] =
    useControllableValue<BaseType>(props);

  const collapsable = value.type === 'array' || value.type === 'object';
  const addChild = value.type === 'object';

  const prefix: React.ReactElement[] = [];
  if (draggable) {
    prefix.push(
      <div key="draggable" className={px('item-space')}>
        <IconButton
          className={px('drag-handle')}
          size="small"
          draggable
          onDragStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDrag(e);
          }}
          style={{ cursor: 'row-resize' }}
        >
          <MenuOutlined style={{ color: '#999999' }} />
        </IconButton>
      </div>,
    );
  }
  if (collapsable) {
    prefix.push(
      <div key="collapsable" className={px('item-space')}>
        <IconButton
          size="small"
          onClick={() => {
            onOpenChange(!open);
          }}
        >
          <CaretRightFilled
            className={px('icon', { open })}
            style={{ color: '#999999' }}
          />
        </IconButton>
      </div>,
    );
  }

  const buttons: React.ReactElement[] = [];
  if (addSiblings) {
    buttons.push(
      <IconButton
        size="small"
        onClick={() => {
          onDelete();
        }}
      >
        <CloseOutlined style={{ color: '#FF6666' }} />
      </IconButton>,
    );
  }
  if (addSiblings && addChild) {
    // 可添加子节点和相邻节点，需要使用 Dropdown
    buttons.push(
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              key="1"
              onClick={() => {
                onAddSiblings();
              }}
            >
              添加相邻节点
            </Menu.Item>
            <Menu.Item
              key="2"
              onClick={() => {
                onAddChild();
              }}
            >
              添加子节点
            </Menu.Item>
          </Menu>
        }
      >
        <IconButton size="small">
          <PlusOutlined style={{ color: '#1199ff' }} />
        </IconButton>
      </Dropdown>,
    );
  } else if (addSiblings || addChild) {
    buttons.push(
      <Tooltip title={addSiblings ? '添加相邻节点' : '添加子节点'}>
        <IconButton
          size="small"
          onClick={() => {
            if (addSiblings) {
              onAddSiblings();
            } else {
              onAddChild();
            }
          }}
        >
          <PlusOutlined style={{ color: '#1199ff' }} />
        </IconButton>
      </Tooltip>,
    );
  }

  return (
    <div className={px('item')} {...otherProps}>
      <div className={px('item-left')}>
        <div
          className={px('item-space')}
          style={{ width: 32 * (level + 1 - prefix.length) }}
        />
        {prefix}
        <UcInput
          placeholder="属性名称"
          value={root ? 'root' : value.name ?? ''}
          disabled={nameDisabled}
          onChange={(name) => {
            setValue({ ...value, name });
          }}
        />
      </div>
      <div className={px('item-right')}>
        <Tooltip title="是否必须">
          <div className={px('item-space', 'checkbox')}>
            <Checkbox
              disabled={nameDisabled}
              checked={value.required}
              onChange={(e) => {
                setValue({
                  ...value,
                  required: e.target.checked,
                });
              }}
            />
          </div>
        </Tooltip>
        <Select
          className={px('item-type')}
          value={value.type}
          onChange={(type) => {
            setValue({
              ...value,
              type,
            });
          }}
        >
          {jsonValueTypes.map((value) => (
            <Select.Option key={value} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
        <Tooltip title="可否为Null">
          <div className={px('item-space', 'checkbox')}>
            <Checkbox
              checked={value.nullable}
              onChange={(e) => {
                setValue({
                  ...value,
                  nullable: e.target.checked,
                });
              }}
            />
          </div>
        </Tooltip>
        <UcInput
          placeholder="描述"
          value={value.description ?? ''}
          onChange={(description) => {
            setValue({ ...value, description });
          }}
        />
        <div style={{ minWidth: 4 }} />
        <UcInput
          placeholder="默认值"
          disabled={defaultValueDisabled}
          value={value.defaultValue ?? ''}
          onChange={(defaultValue) => {
            setValue({ ...value, defaultValue });
          }}
        />
        <div className={px('item-space', 'button')}>{buttons[0]}</div>
        <div className={px('item-space', 'button')}>{buttons[1]}</div>
      </div>
    </div>
  );
};

export interface JsonSchemaEditorProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {
  // 结构数据
  defaultValue?: JsonValueType;
  value?: JsonValueType;
  onChange?: (value: JsonValueType) => void;
  // 节点层级
  level?: number;
  // 是否支持添加相邻节点
  addSiblings?: boolean;
  onAddSiblings?: () => void;
  draggable?: boolean;
  onDrag?: () => void;
  onDelete?: () => void;
  nameDisabled?: boolean;
  defaultValueDisabled?: boolean;
  root?: boolean;
}

const JsonSchemaEditor = (props: JsonSchemaEditorProps) => {
  const {
    className = '',
    value: nouse,
    defaultValue,
    onChange,
    level = 0,
    addSiblings = false,
    draggable,
    onDrag,
    onAddSiblings = ef,
    nameDisabled = true,
    defaultValueDisabled: _defaultValueDisabled,
    root = true,
    onDelete,
    ...otherProps
  } = props;
  const [value = {} as JsonValueType, _setValue] =
    useControllableValue<JsonValueType>(props);
  // 默认情况下，Object 和 null 类型无法编辑默认值
  const defaultValueDisabled =
    _defaultValueDisabled ?? (value.type === 'object' || value.type === 'null');
  const collapsable = value.type === 'array' || value.type === 'object';
  const [open, setOpen] = useState(true);

  const setValue = useMemoizedFn((newValue: JsonValueType) => {
    // 如果类型有变化，则对 items 进行校验
    if (newValue.type !== value.type) {
      if (newValue.type === 'array') {
        // 重置 items 为 items
        _setValue({
          ...newValue,
          items: [
            {
              name: 'items',
              type: 'string',
            },
          ],
        });
        return;
      } else if (newValue.type === 'object') {
        // 重置 items 为 空数组
        _setValue({ ...newValue, items: [] });
        return;
      } else if ('items' in newValue) {
        // @ts-expect-error
        const { items, ...v } = newValue;
        _setValue(v);
        return;
      }
    }
    _setValue(newValue);
  });

  const handleAddChild = useMemoizedFn(() => {
    if (value.type === 'object') {
      setValue({
        ...value,
        items: [
          ...value.items,
          {
            type: 'string',
            name: '',
          },
        ],
      });
    }
  });
  const handleAddSiblings = useMemoizedFn((index: number) => {
    if (value.type === 'object') {
      setValue({
        ...value,
        items: insertArr(value.items, index + 1, {
          type: 'string',
          name: '',
        }),
      });
    }
  });
  const handleDelete = useMemoizedFn((index: number) => {
    if (value.type === 'object') {
      setValue({
        ...value,
        items: removeArrIndex(value.items, index),
      });
    }
  });

  return (
    <div className={`${px('root')} ${className}`} {...otherProps}>
      <JsonSchemaItem
        value={value}
        level={level}
        open={open}
        root={root}
        draggable={draggable}
        onDrag={onDrag}
        onOpenChange={setOpen}
        onAddChild={handleAddChild}
        onAddSiblings={onAddSiblings}
        nameDisabled={nameDisabled}
        defaultValueDisabled={defaultValueDisabled}
        onDelete={onDelete}
        onChange={(v) => {
          setValue({
            ...value,
            ...v,
          });
        }}
        addSiblings={addSiblings}
      />
      {collapsable && (
        <OpenBox key={`${value.items.length > 0}`} open={open}>
          <DraggableList<JsonValueType>
            noHoverStyle
            checkable={false}
            data={value.items ?? []}
            customDragHandler
            onDataChange={(items) => {
              setValue({
                ...value,
                items,
              });
            }}
          >
            {(item, params, index) => (
              <JsonSchemaEditor
                value={item}
                level={level + 1}
                draggable={value.type === 'object'}
                onDrag={params.drag}
                addSiblings={value.type === 'object'}
                onChange={(v) => {
                  params.changeItem(v);
                }}
                onAddSiblings={() => {
                  handleAddSiblings(index);
                }}
                nameDisabled={value.type === 'array'}
                defaultValueDisabled={
                  _defaultValueDisabled || value.type === 'array'
                    ? true
                    : undefined
                }
                root={false}
                onDelete={() => {
                  handleDelete(index);
                }}
              />
            )}
          </DraggableList>
        </OpenBox>
      )}
    </div>
  );
};

JsonSchemaEditor.toTypeScriptDefinition = toTypeScriptDefinition;
JsonSchemaEditor.defaultValueFromJsonSchema = defaultValueFromJsonSchema;

export default JsonSchemaEditor;
