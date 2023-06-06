import React, { useRef, useState } from 'react';
import cn from 'classnames';
import { useEventListener } from 'ahooks/es';
import { useAutoScroll } from '@orca-fe/hooks';
import { useDebounceFn } from 'ahooks';
import useStyle from './PDFToolbar.style';

const eArr = [];

export interface PdfToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  value?: string;
  title?: React.ReactNode;
  leftRef?: React.Ref<HTMLDivElement>;
  rightRef?: React.Ref<HTMLDivElement>;
  centerIds?: string[];
  hide?: boolean;
}

const PDFToolbar = (props: PdfToolbarProps) => {
  const { className = '', rightRef, leftRef, centerIds = eArr, title, hide, ...otherProps } = props;
  const styles = useStyle();

  const titleRef = useRef<HTMLDivElement>(null);

  const autoScrollHandle = useAutoScroll(titleRef, { autoTrigger: false, scrollableY: false });

  const [_this] = useState({
    enter: false,
    mousedown: false,
  });

  const resetTitleScroll = useDebounceFn(
    () => {
      const dom = titleRef.current;
      if (dom) {
        dom.scrollLeft = 0;
      }
    },
    { wait: 2000 },
  );

  useEventListener(
    'mousedown',
    () => {
      _this.mousedown = true;
      autoScrollHandle.start();
      resetTitleScroll.cancel();
    },
    { target: titleRef },
  );

  useEventListener('mouseup', () => {
    _this.mousedown = false;
    if (!_this.enter) {
      autoScrollHandle.stop();
      resetTitleScroll.run();
    }
  });

  useEventListener(
    'mouseenter',
    () => {
      _this.enter = true;
      autoScrollHandle.start();
      resetTitleScroll.cancel();
    },
    { target: titleRef },
  );

  useEventListener(
    'mouseleave',
    () => {
      _this.enter = false;
      if (!_this.mousedown) {
        autoScrollHandle.stop();
        resetTitleScroll.run();
      }
    },
    { target: titleRef },
  );

  return (
    <div className={cn(styles.root, { [styles.hide]: hide }, className)} {...otherProps}>
      <div ref={leftRef} className={styles.left} />
      <div ref={titleRef} className={styles.title}>
        {title}
      </div>
      <div className={styles.center}>
        {centerIds.map((id, index) => (
          <React.Fragment key={id}>
            {index > 0 && <div className={styles.separator} />}
            <span id={id} />
          </React.Fragment>
        ))}
      </div>
      <div ref={rightRef} className={styles.right} />
    </div>
  );
};

export default PDFToolbar;
