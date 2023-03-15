import React from 'react';
import useStyle from './PDFToolbar.style';

export interface PdfToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;

  leftRef?: React.Ref<HTMLDivElement>;
  centerRef?: React.Ref<HTMLDivElement>;
  rightRef?: React.Ref<HTMLDivElement>;
}

const PDFToolbar = (props: PdfToolbarProps) => {
  const { className = '', rightRef, leftRef, centerRef, ...otherProps } = props;
  const styles = useStyle();

  return (
    <div className={`${styles.root} ${className}`} {...otherProps}>
      <div ref={leftRef} className={styles.left} />
      <div ref={centerRef} className={styles.center} />
      <div ref={rightRef} className={styles.right} />
    </div>
  );
};

export default PDFToolbar;
