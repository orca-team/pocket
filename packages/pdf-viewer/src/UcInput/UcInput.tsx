import type { InputHTMLAttributes } from 'react';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useControllableValue, useEventListener } from 'ahooks';
import { useMemorizedFn, useMergedRefs } from '@orca-fe/hooks';

export interface UcInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void;
}

const UcInput = forwardRef<HTMLInputElement, UcInputProps>((props, pRef) => {
  const [value, setValue] = useControllableValue(props);
  const [focused, setFocused] = useState(false);

  const [internalValue, setInternalValue] = useState(value);

  const rootRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(rootRef, pRef);

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
    const input = rootRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      return () => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      };
    }
    return undefined;
  }, []);

  useEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setValue(internalValue);
      }
    },
    { target: rootRef },
  );

  return (
    <input
      ref={mergedRef}
      {...props}
      value={focused ? internalValue : value}
      onChange={(e) => {
        setInternalValue(e.target.value);
      }}
    />
  );
});

export default UcInput;
