import React from 'react';
import Color from 'color';
import { catcher } from '@orca-fe/tools';
import useStyle from './ColorPreview.style';

export interface ColorPreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  border?: boolean | string;
  size?: number;
}

const ColorPreview = (props: ColorPreviewProps) => {
  const { className = '', color, size, style, border, ...otherProps } = props;
  const styles = useStyle();
  return (
    <div
      className={`${styles.root} ${className}`}
      {...otherProps}
      style={{
        width: size,
        height: size,
        ...style,
        border: 'none',
      }}
    >
      <div
        className={styles.color}
        style={{
          border:
            typeof border === 'string'
              ? border
              : catcher(
                  () =>
                    `1px solid ${
                      Color(color).isDark() ? '#ffffff' : '#000000'
                    }`,
                  '',
                ),
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default ColorPreview;
