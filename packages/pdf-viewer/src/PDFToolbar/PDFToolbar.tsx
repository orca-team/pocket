import React from 'react';
import cn from 'classnames';
import useStyle from './PDFToolbar.style';

const eArr = [];

export interface PdfToolbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  value?: string;
  title?: React.ReactNode;
  leftRef?: React.Ref<HTMLDivElement>;
  rightRef?: React.Ref<HTMLDivElement>;
  centerIds?: string[];
  hide?: boolean;
}

const PDFToolbar = (props: PdfToolbarProps) => {
  const {
    className = '',
    rightRef,
    leftRef,
    centerIds = eArr,
    title,
    hide,
    ...otherProps
  } = props;
  const styles = useStyle();

  return (
    <div
      className={cn(styles.root, { [styles.hide]: hide }, className)}
      {...otherProps}
    >
      <div ref={leftRef} className={styles.left} />
      <div className={styles.title}>{title}</div>
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
