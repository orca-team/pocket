import type { ComponentType, ForwardRefRenderFunction } from 'react';
import React from 'react';
import ReactScript from './ReactScript';

export default function withScript(src: string | string[]) {
  return function <E extends ComponentType | ForwardRefRenderFunction<any>>(
    Element: E,
  ) {
    const ComponentWithProps = React.forwardRef<any, any>((props, ref) => (
      <ReactScript src={src}>
        <Element ref={ref} {...props} />
      </ReactScript>
    ));

    return ComponentWithProps as unknown as E;
  };
}
