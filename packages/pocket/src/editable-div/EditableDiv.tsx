import React, { useEffect, useRef, useState } from 'react';
import { useControllableValue, useEventListener } from 'ahooks';
import { useMergedRefs } from '@orca-fe/hooks';
import cn from 'classnames';
import useStyles from './EditableDiv.style';

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

export interface EditableDivProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  editing?: boolean;
  onEditChange?: (editing: boolean) => void;
  compact?: boolean;
  trigger?: 'dblclick' | 'click' | 'mouseup' | 'mousedown' | 'focus';
  transparent?: boolean;
  stopPropagationWhenEditing?: boolean;
  breakWord?: boolean;
}

const EditableDiv = React.forwardRef<HTMLDivElement, EditableDivProps>((props, pRef) => {
  const {
    className = '',
    value: nouse,
    defaultValue,
    onEditChange,
    editing: nouse2,
    onChange,
    compact,
    trigger = 'dblclick',
    transparent,
    stopPropagationWhenEditing,
    breakWord,
    ...otherProps
  } = props;
  const styles = useStyles();
  const [value, setValue] = useControllableValue(props);
  const [editing, setEditing] = useControllableValue(props, {
    defaultValue: false,
    trigger: 'onEditChange',
    defaultValuePropName: 'noDefaultValue',
    valuePropName: 'editing',
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const mergedRootRef = useMergedRefs(rootRef, pRef);

  const [_this] = useState({
    lastValue: '',
    lastEditing: editing,
  });

  const confirm = () => {
    if (preRef.current) {
      const editingValue = preRef.current.innerText;
      setValue(editingValue);
      setEditing(false);
    }
  };

  useEventListener(
    'blur',
    (e) => {
      confirm();
    },
    { target: preRef },
  );

  useEventListener(
    trigger,
    (e) => {
      if (!editing) {
        setEditing(true);
      }
    },
    { target: rootRef },
  );

  useEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (editing) {
        e.stopPropagation();
      }
      const { key, ctrlKey, altKey, shiftKey } = e;

      if (key === 'Escape') {
        // 取消本次编辑
        setEditing(false);
      }
      if (key === 'Enter' && !ctrlKey && !altKey && !shiftKey) {
        // 确认本次编辑
        e.preventDefault();
        confirm();
      }
    },
    { target: preRef },
  );

  useEffect(() => {
    if (preRef.current) {
      if (editing) {
        preRef.current.focus();
        selectDom(preRef.current);
      }
    }
  }, [editing]);

  useEffect(() => {
    if (preRef.current) {
      if (_this.lastValue !== value || _this.lastEditing !== editing) {
        if (!editing) {
          preRef.current.innerText = value;
        }
        _this.lastValue = value;
        _this.lastEditing = editing;
      }
    }
  });

  return (
    <div
      ref={mergedRootRef}
      className={`${cn(styles.root, {
        [styles.editing]: editing,
        [styles.compact]: compact,
        [styles.transparent]: transparent,
        [styles.breakWord]: breakWord,
      })} ${className}`}
      {...otherProps}
    >
      <pre ref={preRef} contentEditable={editing ? 'plaintext-only' : 'false'} />
    </div>
  );
});

export default EditableDiv;
