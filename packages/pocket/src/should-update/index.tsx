import React from 'react';

export default function shouldUpdate<Props>(
  Comp: React.ComponentClass<Props> | React.FunctionComponent<Props>,
  shouldComponentUpdateFn: (props: Props, prevProps: Props) => boolean,
) {
  return class ShouldUpdateComponent extends React.Component<Props, unknown> {
    shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
      return shouldComponentUpdateFn(nextProps, this.props);
    }

    render() {
      return <Comp {...this.props} />;
    }
  };
}
