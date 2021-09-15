import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import pc from 'prefix-classnames';

const px = pc('orca-img');

let defaultErrSrc = <div className={px('error-tip')}>暂无图片</div>;
let ef = () => undefined;

export interface ImgProps extends React.HTMLAttributes<HTMLImageElement> {
  imgRef?:
    | ((instance: HTMLImageElement) => void)
    | React.MutableRefObject<HTMLImageElement>;

  /* 图片链接 */
  src: string;

  /* 是否按图片默认大小 */
  stretch?: boolean;

  /* loading图片 */
  loadingSrc?: React.ReactElement | string;

  /* 错误图片 */
  errSrc?: React.ReactElement | string;
}

const Img = React.forwardRef<HTMLDivElement, ImgProps>((props, pRef) => {
  const {
    imgRef,
    className,
    src,
    loadingSrc,
    errSrc = defaultErrSrc,
    stretch = true,
    onLoad = ef,
    onError = ef,
    ...otherProps
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(pRef, () => ref.current!);

  const [imgState, setImgState] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );
  useEffect(() => {
    if (!src) {
      setImgState('error');
    } else {
      setImgState('loading');
    }
  }, [src]);

  const handleLoad = useCallback<typeof onLoad>(
    (event) => {
      if (imgState !== 'loaded') {
        setImgState('loaded');
      }
      return onLoad(event);
    },
    [imgState],
  );
  const handleError = useCallback<typeof onError>(
    (event) => {
      if (imgState !== 'error') {
        setImgState('error');
      }
      return onError(event);
    },
    [imgState],
  );
  return (
    <div ref={ref} className={`${px('root')} ${className}`} {...otherProps}>
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
      {imgState === 'loading' &&
        (typeof loadingSrc === 'string' ? (
          <img className={px('loading')} alt="" src={loadingSrc} />
        ) : (
          loadingSrc
        ))}
      {imgState === 'error' &&
        (typeof errSrc === 'string' ? (
          <img className={px('loading')} alt="" src={errSrc} />
        ) : (
          errSrc
        ))}
    </div>
  );
});

export default Img;
