import type { ComponentType } from 'react';
import React from 'react';
import ReactScript from './ReactScript';

export default function withScript(src: string | string[]) {
  return function <P>(Element: ComponentType<P>) {
    const ComponentWithProps = React.forwardRef<Element, P>((props: P, ref) => (
      <ReactScript src={src}>
        <Element ref={ref} {...props} />
      </ReactScript>
    ));

    return ComponentWithProps;
  };
}
