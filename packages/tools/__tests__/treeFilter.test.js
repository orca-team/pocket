const { treeFilter } = require('../src/tree');

// 测试用例
describe('@orca-fe/tools: treeFilter', () => {
  it('TreeFilter test 1', () => {
    const tree = [
      {
        id: '1',
        attr: true,
        children: [
          {
            id: '1-1',
            attr: true,
          },
        ],
      },
    ];
    const newTree = treeFilter(tree, (item) => true);
    expect(newTree).toEqual(tree);
  });

  it('TreeFilter test 2: filter `attr`', () => {
    const tree = [
      {
        id: '1',
        attr: true,
        children: [
          {
            id: '1-1',
            attr: false,
          },
          {
            id: '1-2',
            attr: true,
          },
        ],
      },
      {
        id: '2',
        attr: true,
        children: [
          {
            id: '2-1',
            attr: false,
          },
          {
            id: '2-2',
            attr: true,
          },
        ],
      },
    ];

    const newTree = treeFilter(tree, (item) => item.attr);
    expect(newTree).toEqual([
      {
        id: '1',
        attr: true,
        children: [
          {
            id: '1-2',
            attr: true,
          },
        ],
      },
      {
        id: '2',
        attr: true,
        children: [
          {
            id: '2-2',
            attr: true,
          },
        ],
      },
    ]);
  });
  it('TreeFilter test 3: keep parent', () => {
    const tree = [
      {
        id: '1',
        attr: false,
        children: [
          {
            id: '1-1',
            attr: false,
          },
          {
            id: '1-2',
            attr: true,
          },
        ],
      },
      {
        id: '2',
        attr: false,
        children: [
          {
            id: '2-1',
            attr: false,
          },
          {
            id: '2-2',
            attr: false,
          },
        ],
      },
    ];

    const newTree = treeFilter(tree, (item) => item.attr);
    expect(newTree).toEqual([
      {
        id: '1',
        attr: false,
        children: [
          {
            id: '1-2',
            attr: true,
          },
        ],
      },
    ]);
  });
  it('TreeFilter test 4: remove all', () => {
    const tree = [
      {
        id: '1',
        attr: false,
        children: [
          {
            id: '1-1',
            attr: false,
          },
          {
            id: '1-2',
            attr: true,
          },
        ],
      },
      {
        id: '2',
        attr: false,
        children: [
          {
            id: '2-1',
            attr: false,
          },
          {
            id: '2-2',
            attr: false,
          },
        ],
      },
    ];

    const newTree = treeFilter(tree, (item) => false);
    expect(newTree).toEqual([]);
  });
});
