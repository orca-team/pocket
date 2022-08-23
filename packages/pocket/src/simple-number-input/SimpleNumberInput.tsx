import React, { useEffect, useMemo, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import { useControllableValue, useEventListener } from 'ahooks';
import { clamp } from '@orca-fe/tools';

const px = pc('simple-number-input');

function selectDom(dom: HTMLElement) {
  // @ts-expect-error
  if (document.selection) {
    // @ts-expect-error
    const range = document.body.createTextRange();
    range.moveToElementText(dom);
    range.select();
  } else if (window.getSelection) {
    const range = document.createRange();
    range.selectNodeContents(dom);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  }
}

export interface SimpleNumberInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  editable?: boolean;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  triggerOnDrag?: boolean;
  step?: number;
  min?: number;
  max?: number;
}

const SimpleNumberInput = (props: SimpleNumberInputProps) => {
  const {
    className = '',
    editable = true,
    onChange,
    min,
    max,
    step = 1,
    triggerOnDrag = true,
    ...otherProps
  } = props;
  const [_value, setValue] = useControllableValue(props, {
    defaultValue: 0,
  });

  const value = clamp(_value, min, max);

  const rootRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  const decimalLength = useMemo(() => {
    const strValue = String(step);
    const i = strValue.indexOf('.');
    if (i >= 0) {
      return strValue.length - 1 - i;
    }
    return 0;
  }, [step]);

  const confirm = () => {
    if (rootRef.current) {
      const editingValue = rootRef.current.innerText;
      rootRef.current.innerText = `${value}`;
      console.warn(editingValue);
      if (!Number.isNaN(Number(editingValue))) {
        setValue(clamp(Number(editingValue), min, max));
      }
      setEditing(false);
    }
  };

  const [_this] = useState({
    lastValue: Number.NaN,
    lastEditing: editing,
    focus: false,
    // 开始拖拽时鼠标的位置
    startPageX: undefined as number | undefined,
    // 开始拖拽时的具体值
    startValue: undefined as number | undefined,
    // 是否真正执行了拖拽
    moved: false,
  });

  useEventListener(
    'mousedown',
    (e) => {
      if (!editing && editable) {
        e.preventDefault();
        _this.startPageX = e.pageX;
        _this.startValue = Number(value) || 0;
        _this.moved = false;
      }
    },
    { target: rootRef },
  );

  useEventListener('mousemove', (e) => {
    if (
      _this.startPageX != null &&
      _this.startValue != null &&
      rootRef.current
    ) {
      let offset: number = e.pageX - _this.startPageX;
      const weakRange = 6;
      const weakTimes = 5;
      if (Math.abs(offset) <= weakRange * weakTimes) {
        offset = Math.round(offset / weakTimes);
      } else {
        offset = Math.round(
          Math.sign(offset) *
            (Math.abs(offset) - weakRange * weakTimes + weakRange),
        );
      }
      if (!_this.moved && Math.abs(offset) > 0) {
        _this.moved = true;
      }
      let newValue = _this.startValue + offset * step;
      // rootRef.current.innerText = `${Number(newValue.toFixed(decimalLength))}`;
      newValue = clamp(Number(newValue.toFixed(decimalLength)), min, max);
      if (triggerOnDrag) {
        setValue(newValue);
      } else {
        rootRef.current.innerText = `${Number(
          newValue.toFixed(decimalLength),
        )}`;
      }
    }
  });

  useEventListener(
    'click',
    (e) => {
      if (!_this.moved && editable) {
        _this.startPageX = undefined;
        setEditing(true);
      }
    },
    { target: rootRef },
  );
  useEventListener('mouseup', (e) => {
    if (_this.moved) {
      _this.moved = false;
      _this.startPageX = undefined;
      confirm();
    }
  });

  useEventListener(
    'focus',
    (e) => {
      _this.focus = true;
    },
    { target: rootRef },
  );
  useEventListener(
    'blur',
    (e) => {
      if (_this.focus) {
        confirm();
      }
    },
    { target: rootRef },
  );

  useEventListener(
    'keydown',
    (e) => {
      const { key } = e;
      if (rootRef.current) {
        if (key === 'ArrowUp' || key === 'ArrowDown') {
          e.preventDefault();
          const editingValue = rootRef.current.innerText;
          rootRef.current.innerText = `${clamp(
            Number(editingValue) + step * (key === 'ArrowUp' ? 1 : -1),
            min,
            max,
          )}`;
          selectDom(rootRef.current);
        }
      }

      if (key === 'Escape') {
        // 取消本次编辑
        _this.focus = false;
        setEditing(false);
      }
      if (key === 'Enter') {
        // 确认本次编辑
        e.preventDefault();
        _this.focus = false;
        confirm();
      }
    },
    { target: rootRef },
  );

  useEffect(() => {
    if (rootRef.current) {
      if (editing) {
        rootRef.current.focus();
        selectDom(rootRef.current);
      }
    }
  }, [editing]);

  useEffect(() => {
    if (rootRef.current) {
      if (_this.lastValue !== value || _this.lastEditing !== editing) {
        if (!editing) {
          rootRef.current.innerText = `${value}`;
        }
        _this.lastValue = value;
        _this.lastEditing = editing;
      }
    }
  });

  return (
    <div
      ref={rootRef}
      className={`${px('root', { editing, editable })} ${className}`}
      {...otherProps}
      // @ts-expect-error
      contentEditable={editing ? 'plaintext-only' : 'false'}
    />
  );
};

export default SimpleNumberInput;
