import { useIsomorphicLayoutEffect } from 'ahooks';

export default function createUseStaticCss(css: string) {
  let count = 0;
  let styleElement: HTMLStyleElement;
  return function useStaticCss() {
    useIsomorphicLayoutEffect(() => {
      if (count === 0) {
        styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
      }
      count += 1;
      return () => {
        count -= 1;
        if (count === 0) {
          document.head.removeChild(styleElement);
        }
      };
    });
  };
}
