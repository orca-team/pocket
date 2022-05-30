import type React from 'react';
import * as ReactDOM from 'react-dom';

export interface PortalRenderOptions {
  getContainer?: () => HTMLElement;
}

const defaultGetContainer: PortalRenderOptions['getContainer'] = () =>
  document.body;

export const render = (
  jsx: React.ReactElement,
  options: PortalRenderOptions = {},
) => {
  const { getContainer = defaultGetContainer } = options;
  const root = document.createElement('div');
  const container = getContainer();
  container.appendChild(root);
  ReactDOM.render(jsx, root);
  let removed = false;

  return () => {
    if (removed) return;
    ReactDOM.unmountComponentAtNode(root);
    try {
      container.removeChild(root);
    } catch (error) {}
    removed = true;
  };
};
