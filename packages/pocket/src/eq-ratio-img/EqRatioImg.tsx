import React, { useEffect, useMemo, useState } from 'react';
import pc from 'prefix-classnames';
import { useControllableProps, useMemorizedFn } from '@orca-fe/hooks';
import cn from 'classnames';
import useStyles from './EqRatioImg.style';

const px = pc('eq-ratio-img');

const ef = () => {};

const failedComponent = <div className={px('error-tip')}>暂无图片</div>;

export interface EqRatioImgProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad' | 'onError'>,
    Pick<React.HTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {

  /** 图片 ref */
  imgRef?: ((instance: HTMLImageElement) => void) | React.MutableRefObject<HTMLImageElement>;

  /** 图片链接 */
  src?: string;

  /** 受控状态 */
  status?: 'loading' | 'failed' | 'loaded';

  /** loading的图片地址 */
  loadingSrc?: string | React.ReactElement;

  /** 异常的图片地址 */
  errSrc?: string | React.ReactElement;

  /** 拉伸模式 */
  mode?: 'normal' | 'scale' | 'cover' | 'contain' | string;

  /** 图片的位置排布（backgroundPosition） */
  imgPosition?: string;
}

function getRealBackgroundSize(mode: EqRatioImgProps['mode']) {
  if (mode === 'scale') {
    return '100% 100%';
  }
  if (mode === 'normal') {
    return '100% auto';
  }
  return mode;
}

const EqRatioImg = (props: EqRatioImgProps) => {
  const { src: _src } = props;
  const [
    {
      className = '',
      src,
      mode = 'normal',
      onLoad = ef,
      onError = ef,
      status,
      loadingSrc,
      errSrc = failedComponent,
      imgPosition: backgroundPosition,
      ...otherProps
    },
    changeProps,
  ] = useControllableProps(props, {
    status: _src ? 'loading' : 'failed',
  });
  const styles = useStyles();

  const setStatus = useMemorizedFn((status) => {
    changeProps({
      status,
    });
  });

  const isLoading = status === 'loading';
  const isFailed = status === 'failed';
  const isLoaded = status === 'loaded';

  const [_this] = useState(() => ({
    status,
  }));

  useMemo(() => {
    if (src && status !== 'loading') {
      _this.status = 'loading';
    }
  }, [src]);

  useEffect(() => {
    setStatus(_this.status);
  }, [src]);

  return (
    <div
      className={`${cn(styles.root, {
        [styles.defaultHeight]: mode !== 'normal',
      })} ${className}`}
      {...otherProps}
    >
      {/* hidden src image */}
      <img
        key={src}
        className={cn(styles.hiddenImg, {
          [styles.hiddenImgPlaceholder]: isLoaded && mode === 'normal',
        })}
        src={src}
        onLoad={(e) => {
          _this.status = 'loaded';
          setStatus('loaded');
          onLoad(e);
        }}
        onError={(e) => {
          _this.status = 'failed';
          setStatus('failed');
          console.error(e);
          onError(e);
        }}
      />

      {/* div img */}
      <div
        className={cn(styles.img, { [styles.show]: isLoaded })}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: getRealBackgroundSize(mode),
          backgroundPosition,
        }}
      />

      {/* failed */}
      {typeof errSrc === 'string' ? <img src={errSrc} style={{ display: isFailed ? 'initial' : 'none' }} /> : isFailed && errSrc}
      {/* loading */}
      {typeof loadingSrc === 'string' ? <img src={loadingSrc} style={{ display: isLoading ? 'initial' : 'none' }} /> : isLoading && loadingSrc}
    </div>
  );
};

export default EqRatioImg;
