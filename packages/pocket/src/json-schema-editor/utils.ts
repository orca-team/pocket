import { JsonValueType } from './defs';

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
