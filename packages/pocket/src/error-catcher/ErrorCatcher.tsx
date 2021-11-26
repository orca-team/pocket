import React from 'react';
import pc from 'prefix-classnames';

const px = pc('error-catcher');

type ErrorState = { error: Error; errorInfo: React.ErrorInfo };

export interface ErrorCatcherProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  errorTips?:
    | React.ReactNode
    | ((
        error: Error,
        errorInfo: React.ErrorInfo,
        reset: () => void,
      ) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorCatcher extends React.Component<
  ErrorCatcherProps,
  { error: false | ErrorState }
> {
  state = {
    error: false as false | ErrorState,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
    const { onError } = this.props;
    this.setState({ error: { error, errorInfo } });
    if (typeof onError === 'function') {
      onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ error: false });
  };

  render() {
    const { children, errorTips, onError, ...otherProps } = this.props;
    const { error } = this.state;
    if (error) {
      return typeof errorTips === 'function' ? (
        errorTips(error.error, error.errorInfo, this.reset)
      ) : (
        <div className={`${px('root')}`} {...otherProps}>
          {errorTips}
        </div>
      );
    }

    return children;
  }
}

export default ErrorCatcher;
