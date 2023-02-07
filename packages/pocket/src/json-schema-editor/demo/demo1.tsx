/**
 * title: 基本用法
 */
import React, { useMemo, useState } from 'react';
import type { JsonValueType } from '@orca-fe/pocket';
import { JsonSchemaEditor } from '@orca-fe/pocket';

const defaultValue: JsonValueType = {
  type: 'object',
  name: 'root',
  items: [
    {
      name: 'prop1',
      type: 'string',
      description: '字符串类属性',
    },
    {
      name: 'prop2',
      type: 'number',
      description: '数字类属性',
    },
    {
      name: 'prop3',
      type: 'boolean',
      description: '布尔值属性',
    },
    {
      name: 'obj',
      type: 'object',
      description: '对象属性',
      items: [
        {
          name: 'value1',
          type: 'string',
        },
        {
          name: 'value2',
          type: 'number',
        },
      ],
    },
    {
      name: 'arr',
      type: 'array',
      description: '数组属性',
      items: [
        {
          name: 'items',
          type: 'string',
        },
      ],
    },
  ],
};

const Demo = (props) => {
  const [value, setValue] = useState<JsonValueType>(defaultValue);

  const str = useMemo(
    () => JsonSchemaEditor.toTypeScriptDefinition(value),
    [value],
  );

  return (
    <div>
      JSON 结构编辑器：
      <JsonSchemaEditor value={value} onChange={setValue} />
      <div style={{ padding: 12, backgroundColor: '#DDDDDD' }}>
        生成TypeScript定义：
        <pre>{str}</pre>
      </div>
    </div>
  );
};

export default Demo;
