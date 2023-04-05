import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import useStyles from './Img.style';

const defaultErrSrc = <div className="orca-img-error-tip">暂无图片</div>;
const ef = () => undefined;

export interface ImgProps extends React.HTMLAttributes<HTMLImageElement> {

  /** 图片 ref */
  imgRef?: ((instance: HTMLImageElement) => void) | React.MutableRefObject<HTMLImageElement>;

  /** 图片链接 */
  src: string;

  /** 是否按图片默认大小 */
  stretch?: boolean;

  /** loading图片 */
  loadingSrc?: React.ReactElement | string;

  /** 错误图片 */
  errSrc?: React.ReactElement | string;
}

const Img = React.forwardRef<HTMLDivElement, ImgProps>((props, pRef) => {
  const { imgRef, className = '', src, loadingSrc, errSrc = defaultErrSrc, stretch = true, onLoad = ef, onError = ef, ...otherProps } = props;
  const styles = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(pRef, () => ref.current!);

  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const [_this] = useState(() => ({
    imgState,
  }));

  useMemo(() => {
    if (!src) {
      _this.imgState = 'error';
    } else {
      _this.imgState = 'loading';
    }
  }, [src]);

  useEffect(() => {
    setImgState(_this.imgState);
  }, [src]);

  const handleLoad = useCallback<typeof onLoad>(
    (event) => {
      if (imgState !== 'loaded') {
        _this.imgState = 'loaded';
        setImgState('loaded');
      }
      onLoad(event);
    },
    [imgState],
  );
  const handleError = useCallback<typeof onError>(
    (event) => {
      if (imgState !== 'error') {
        _this.imgState = 'error';
        setImgState('error');
      }
      onError(event);
    },
    [imgState],
  );
  return (
    <div ref={ref} className={`${styles.root} ${className}`} {...otherProps}>
      <img
        ref={imgRef}
        alt=""
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          visibility: imgState !== 'loaded' ? 'hidden' : 'visible',
          ...(stretch ? { width: '100%', height: '100%' } : {}),
        }}
      />
      {imgState === 'loading' && (typeof loadingSrc === 'string' ? <img className={styles.loading} alt="" src={loadingSrc} /> : loadingSrc)}
      {imgState === 'error' && (typeof errSrc === 'string' ? <img className={styles.loading} alt="" src={errSrc} /> : errSrc)}
    </div>
  );
});

export default Img;
