import React, { useRef } from 'react';
import type { IconButtonProps } from '@orca-fe/pocket';
import { useEventListener } from 'ahooks';
import { FolderOpenOutlined } from '@ant-design/icons';
import { IconButton } from '@orca-fe/pocket';

const ef = () => {};

export interface OpenFileButtonProps extends IconButtonProps {
  onOpenFile?: (file: File) => void;
}

const OpenFileButton = (props: OpenFileButtonProps) => {
  const { onOpenFile = ef, children = <FolderOpenOutlined />, ...otherProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEventListener(
    'click',
    () => {
      const input = inputRef.current;
      if (input) {
        input.click();
      }
    },
    { target: buttonRef },
  );
  return (
    <span>
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          const { files } = e.target as HTMLInputElement;
          if (files?.length) {
            const file = files[0];
            onOpenFile(file);
          }
        }}
        style={{
          pointerEvents: 'none',
          display: 'none',
        }}
      />
      <IconButton ref={buttonRef} {...otherProps}>
        {children}
      </IconButton>
    </span>
  );
};

export default OpenFileButton;
