import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Input, InputProps, InputRef } from 'antd';
import { useControllableValue } from 'ahooks';
import { useMemorizedFn } from '@orca-fe/hooks';

export interface UcInputProps extends Omit<InputProps, 'onChange'> {
  onChange?: (value: string) => void;
}

const UcInput = (props: UcInputProps, pRef: ForwardedRef<InputRef>) => {
  const { onPressEnter } = props;
  const [value, setValue] = useControllableValue(props);
  const [focused, setFocused] = useState(false);

  const [internalValue, setInternalValue] = useState(value);

  const rootRef = useRef<InputRef>(null);
  useImperativeHandle(pRef, () => rootRef.current!);

  const handleFocus = useMemorizedFn(() => {
    setInternalValue(value);
    setFocused(true);
  });

  const handleBlur = useMemorizedFn(() => {
    setFocused(false);
    setValue(internalValue);
  });

  useEffect(() => {
    if (internalValue !== value) {
      setInternalValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (rootRef.current?.input) {
      const { input } = rootRef.current;
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      return () => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      };
    }
    return undefined;
  }, []);

  return (
    <Input
      ref={rootRef}
      {...props}
      value={focused ? internalValue : value}
      onChange={(e) => {
        setInternalValue(e.target.value);
      }}
      onPressEnter={(e) => {
        setValue(internalValue);
        onPressEnter?.(e);
      }}
    />
  );
};

export default React.forwardRef<InputRef, UcInputProps>(UcInput);
