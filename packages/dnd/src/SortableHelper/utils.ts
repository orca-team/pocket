import produce from 'immer';

const get = (data: any[], path: number[], getChildren: (item: any) => any[]) => {
  let root = data;
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    const item = root[index];
    if (!item) return undefined;
    const children = getChildren(item);
    if (!children) return undefined;
    root = children;
  }
  return root;
};

export function treeMove(tree: any[], fromPath: number[], _toPath: number[], getChildren: (item: any) => any[], moveSameParent = false) {
  let toPath = _toPath;
  const newTree = produce(tree, (draft) => {
    const oldParentPath = fromPath.slice(0, fromPath.length - 1);
    const oldParent = get(draft, oldParentPath, getChildren);
    const newParentPath = toPath.slice(0, toPath.length - 1);
    const newParent = get(draft, newParentPath, getChildren);
    const oldIndex = fromPath[fromPath.length - 1];
    const newIndex = toPath[toPath.length - 1];
    if (oldParent && newParent) {
      const item = oldParent[oldIndex];
      // 从 old 位置 移动到 new 位置
      // 如果是同一个父级，则需要判断是否移动
      if (oldParentPath.join(',') === newParentPath.join(',')) {
        if (!moveSameParent) {
          // 不移动，直接返回，并修改 toPath 为 fromPath，表示未移动
          toPath = fromPath;
          return;
        }
      }
      // 如果不是同一个父级，则需要先删除再插入
      oldParent.splice(oldIndex, 1);
      newParent.splice(newIndex, 0, item);
    }
  });
  return {
    tree: newTree,
    toPath,
  };
}
