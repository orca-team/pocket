import JSON5 from 'json5';
import type { JsonValueType } from './defs';

function _tab(length = 1, tabSize = 2) {
  return ' '.repeat(length * tabSize);
}

export type ToTypeScriptDefinitionOptions = {
  rootName?: string;
  tabSize?: number;
  comment?: boolean;
};

export function toTypeScriptDefinition(
  value: JsonValueType,
  options: ToTypeScriptDefinitionOptions = {},
) {
  const { tabSize, rootName = 'JsonType', comment = true } = options;

  const tab = (length: number) => _tab(length, tabSize);

  function rev(root: JsonValueType, level = 0) {
    const res: string[] = [];
    switch (root.type) {
      case 'object':
        res.push('{');
        (root.items || []).forEach((objValue) => {
          if (!objValue.name) return;
          if (objValue.description && comment) {
            res.push(`${tab(level + 1)}//${objValue.description}`);
          }
          res.push(
            `${tab(level + 1)}${objValue.name}${
              objValue.required ? '' : '?'
            }: ${rev(objValue, level + 1)};`,
          );
        });
        res.push(`${tab(level)}}`);
        break;
      case 'array':
        res.push('[');
        (root.items || []).forEach((arrValue) => {
          if (arrValue.description && comment) {
            if (!arrValue.name) return;
            res.push(`${tab(level + 1)}//${arrValue.description}`);
          }
          res.push(`${tab(level + 1)}${rev(arrValue, level + 1)},`);
        });
        res.push(`${tab(level)}]`);
        break;
      default:
        res.push(String(root.type));
    }
    return res.join('\n');
  }

  return `type ${rootName} = ${rev(value)}`;
}

export function defaultValueFromJsonSchema(schema: JsonValueType) {
  switch (schema.type) {
    case 'null':
      return null;
    case 'number': {
      const value = Number(schema.defaultValue);
      if (Number.isNaN(value)) {
        return 0;
      }
      return value;
    }
    case 'string':
      return schema.defaultValue;
    case 'boolean': {
      return schema.required ? !!schema.defaultValue : schema.defaultValue;
    }
    case 'array':
      try {
        if (schema.defaultValue) {
          return JSON5.parse(schema.defaultValue);
        }
      } catch (error) {
        console.warn('Error while parsing defaultValue');
      }
      if (schema.required) {
        return [];
      }
      return undefined;
    case 'object': {
      const res = {};
      schema.items.forEach((item) => {
        res[item.name] = defaultValueFromJsonSchema(item);
      });
      return res;
    }
  }
  return undefined;
}
