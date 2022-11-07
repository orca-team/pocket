/**
 * check is `dom` inside parent with `classNames`
 * @param dom
 * @param classNames
 * @param parent
 */
export default function isIn(
  dom: HTMLElement,
  classNames: string | string[],
  parent = document.body,
) {
  let cName = classNames;
  if (typeof classNames === 'string') {
    cName = [classNames];
  }
  if (dom) {
    for (let i = 0; i < cName.length; i += 1) {
      const className = cName[i];
      if (dom.classList.contains(className)) {
        return true;
      }
    }
    if (dom === parent) {
      return false;
    }
    if (dom.parentElement) return isIn(dom.parentElement, classNames, parent);
  }
  return false;
}

/**
 * check is `dom` inside something
 * @param dom
 * @param callback
 * @param parent
 */
export function isInBy(
  dom: HTMLElement,
  callback: (node: HTMLElement) => boolean,
  parent = document.body,
) {
  if (dom) {
    if (dom === parent) {
      return false;
    }
    if (callback(dom)) return true;
    if (dom.parentElement) return isInBy(dom.parentElement, callback, parent);
  }
  return false;
}
