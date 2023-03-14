import { SheetsManager } from 'jss';

const defaultManagers = new Map();

export const getManager = (managerId) => {
  // If `managers` map is present in the context, we use it in order to
  // let JssProvider reset them when new response has to render server-side.

  let manager = defaultManagers.get(managerId);

  if (!manager) {
    manager = new SheetsManager();
    defaultManagers.set(managerId, manager);
  }

  return manager;
};

export const manageSheet = (key, options) => {
  const { sheet, index } = options;
  if (!sheet) {
    return;
  }

  const manager = getManager(index);
  manager.manage(key);
};

export const unmanageSheet = (key, options) => {
  if (!options.sheet) {
    return;
  }

  const manager = getManager(options.index);

  manager.unmanage(key);
};
