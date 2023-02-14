import type { ComponentType, ForwardRefRenderFunction } from 'react';
import React from 'react';
import ReactScript from './ReactScript';

export default function withScript(src: string | string[]) {
  return function <
    T,
    P,
    E extends ComponentType<P> | ForwardRefRenderFunction<T, P>,
  >(Element: E) {
    const ComponentWithProps = React.forwardRef<T, P>((props, ref) => (
      <ReactScript src={src}>
        {/* @ts-expect-error */}
        <Element ref={ref} {...props} />
      </ReactScript>
    ));

    return ComponentWithProps as unknown as E;
  };
}
