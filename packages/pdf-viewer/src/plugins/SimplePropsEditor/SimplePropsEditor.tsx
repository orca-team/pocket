import React from 'react';
import { SimpleForm, Slider } from '@orca-fe/pocket';
import type { ColorPickerProps } from '@orca-fe/painter';
import { ColorPicker } from '@orca-fe/painter';
import useStyles from './SimplePropsEditor.style';
import type { PropsType } from './def';

const ef = () => {};

export interface SimplePropsEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  propsDef?: PropsType[];
  value?: Record<string, any>;
  onChange?: (value: Record<string, any>) => void;
  colorTriggerProps?: ColorPickerProps['triggerProps'];
}

/**
 * 用于图形的属性编辑器，支持的属性类型有：
 * - strokeWidth 绘图宽度
 * @param props
 * @constructor
 */
const SimplePropsEditor = (props: SimplePropsEditorProps) => {
  const { className = '', propsDef = [], value, onChange = ef, colorTriggerProps, ...otherProps } = props;
  const styles = useStyles();
  return (
    <SimpleForm
      initialValues={value}
      onValuesChange={(_, value) => {
        onChange(value);
      }}
    >
      <div className={`${styles.root} ${className}`} {...otherProps}>
        {propsDef.map(({ name, key, type, defaultValue, ...otherProps }) => (
          <React.Fragment key={key}>
            <div>
              {name}
              :
            </div>
            <div
              style={{
                ...(() => {
                  if (type === 'number') {
                    return {
                      paddingLeft: 12,
                      paddingRight: 12,
                    };
                  }
                  if (type === 'color') {
                    return {
                      justifySelf: 'end',
                    };
                  }
                  return {};
                })(),
              }}
            >
              <SimpleForm.Item name={key}>
                {(() => {
                  switch (type) {
                    case 'number':
                      return <Slider {...otherProps} />;
                    case 'font':
                      return <span>fontEditor</span>;
                    case 'color':
                      return <ColorPicker size={24} triggerProps={colorTriggerProps} {...otherProps} />;
                    default:
                      return <span>Unknown Editor</span>;
                  }
                })()}
              </SimpleForm.Item>
            </div>
          </React.Fragment>
        ))}
      </div>
    </SimpleForm>
  );
};

export default SimplePropsEditor;
