export const delay = (interval = 500) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, interval);
  });

const userData = [
  { key: 1, name: 'Tom', age: 12, gender: 'M' },
  { key: 2, name: 'Jack', age: 63, gender: 'M' },
  { key: 3, name: 'Kate', age: 42, gender: 'F' },
  { key: 4, name: 'Green', age: 32, gender: 'F' },
  { key: 5, name: 'Tony', age: 29, gender: 'M' },
  { key: 6, name: 'Lucy', age: 25, gender: 'F' },
  { key: 7, name: 'Mike', age: 38, gender: 'M' },
  { key: 8, name: 'Lily', age: 19, gender: 'F' },
  { key: 9, name: 'John', age: 47, gender: 'M' },
  { key: 10, name: 'Mary', age: 56, gender: 'F' },
  { key: 11, name: 'David', age: 31, gender: 'M' },
  { key: 12, name: 'Sophie', age: 22, gender: 'F' },
  { key: 13, name: 'Alex', age: 27, gender: 'M' },
  { key: 14, name: 'Emily', age: 18, gender: 'F' },
  { key: 15, name: 'Sam', age: 45, gender: 'M' },
  { key: 16, name: 'Grace', age: 29, gender: 'F' },
  { key: 17, name: 'Peter', age: 36, gender: 'M' },
  { key: 18, name: 'Olivia', age: 24, gender: 'F' },
  { key: 19, name: 'Harry', age: 50, gender: 'M' },
  { key: 20, name: 'Emma', age: 21, gender: 'F' },
  { key: 21, name: 'Bob', age: 33, gender: 'M' },
  { key: 22, name: 'Alice', age: 28, gender: 'F' },
  { key: 23, name: 'Frank', age: 41, gender: 'M' },
  { key: 24, name: 'Cathy', age: 35, gender: 'F' },
  { key: 25, name: 'Tim', age: 26, gender: 'M' },
  { key: 26, name: 'Julia', age: 23, gender: 'F' },
  { key: 27, name: 'Bill', age: 39, gender: 'M' },
  { key: 28, name: 'Eva', age: 20, gender: 'F' },
  { key: 29, name: 'Adam', age: 48, gender: 'M' },
  { key: 30, name: 'Nancy', age: 57, gender: 'F' },
  { key: 31, name: 'George', age: 30, gender: 'M' },
  { key: 32, name: 'Maggie', age: 21, gender: 'F' },
  { key: 33, name: 'Chris', age: 28, gender: 'M' },
  { key: 34, name: 'Helen', age: 19, gender: 'F' },
  { key: 35, name: 'Jerry', age: 44, gender: 'M' },
  { key: 36, name: 'Amy', age: 29, gender: 'F' },
  { key: 37, name: 'Tommy', age: 37, gender: 'M' },
  { key: 38, name: 'Sara', age: 25, gender: 'F' },
  { key: 39, name: 'Mark', age: 51, gender: 'M' },
  { key: 40, name: 'Jenny', age: 22, gender: 'F' },
  { key: 41, name: 'Kevin', age: 34, gender: 'M' },
  { key: 42, name: 'Lucas', age: 27, gender: 'M' },
];

// 模拟查找用户列表
export const getUserList = async (params: { name?: string } = {}) => {
  await delay();

  return {
    success: true,
    data: userData.filter(({ name }) => name.toLowerCase().includes(params.name?.toLowerCase() ?? '')),
  };
};

// 模拟查找用户列表（带分页）
export const getUserListPagination = async (params: { name?: string; pageIndex?: number; pageSize?: number } = {}) => {
  const { name: filterName = '', pageIndex = 1, pageSize = 10 } = params;
  await delay();

  const data = userData.filter(({ name }) => name.toLowerCase().includes(filterName.toLowerCase() ?? ''));

  return {
    success: true,
    data: {
      totalCount: data.length,
      list: data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize),
      pageSize,
      pageIndex,
    },
  };
};

export const postWithError = async (params: { info: string }) => {
  await delay();
  if (!params.info) {
    return {
      success: false,
      errMsg: 'info is required.',
      data: null,
    };
  }
  if (Math.random() < 0.5) {
    throw new Error('Internal Error.');
  }
  return {
    success: true,
    errMsg: 'success',
    data: 'ok',
  };
};
