import React, { useEffect, useRef, useState } from 'react';
import pc from 'prefix-classnames';
import './EditableDiv.less';
import { useControllableValue, useEventListener } from 'ahooks';

const px = pc('editable-div');

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

export interface EditableDivProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  editing?: boolean;
  onEditChange?: (editing: boolean) => void;
  compact?: boolean;
}

const EditableDiv = (props: EditableDivProps) => {
  const {
    className = '',
    value: nouse,
    defaultValue,
    onEditChange,
    editing: nouse2,
    onChange,
    compact,
    ...otherProps
  } = props;
  const [value, setValue] = useControllableValue(props);
  const [editing, setEditing] = useControllableValue(props, {
    defaultValue: false,
    trigger: 'onEditChange',
    defaultValuePropName: 'noDefaultValue',
    valuePropName: 'editing',
  });

  const rootRef = useRef<HTMLDivElement>(null);

  const [_this] = useState({
    lastValue: '',
    lastEditing: editing,
  });

  const confirm = () => {
    if (rootRef.current) {
      const editingValue = rootRef.current.innerText;
      setValue(editingValue);
      setEditing(false);
    }
  };

  useEventListener(
    'blur',
    (e) => {
      confirm();
    },
    { target: rootRef },
  );

  useEventListener(
    'keydown',
    (e) => {
      const { key } = e;

      if (key === 'Escape') {
        // 取消本次编辑
        setEditing(false);
      }
      if (key === 'Enter') {
        // 确认本次编辑
        e.preventDefault();
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
          rootRef.current.innerText = value;
        }
        _this.lastValue = value;
        _this.lastEditing = editing;
      }
    }
  });

  return (
    <div
      ref={rootRef}
      className={`${px('root', { editing, compact })} ${className}`}
      {...otherProps}
      // @ts-expect-error
      contentEditable={editing ? 'plaintext-only' : 'false'}
    />
  );
};

export default EditableDiv;
