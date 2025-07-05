import { convertNullToUndefined } from '../src/obj';

// 测试用例
describe('@orca-fe/tools: convertNullToUndefined', () => {
  it('should convert null to undefined', () => {
    expect(convertNullToUndefined(null)).toBeUndefined();
  });

  it('should convert null in object to undefined', () => {
    const obj = {
      a: null,
      b: {
        c: null,
        d: [null, null],
      },
    };
    const newObj = convertNullToUndefined(obj);
    expect(newObj.a).toBeUndefined();
    expect(newObj.b.c).toBeUndefined();
    expect(newObj.b.d[0]).toBeUndefined();
    expect(newObj.b.d[1]).toBeUndefined();
  });

  it('should convert null in array to undefined', () => {
    const arr = [null, { a: null }, [null, null]];
    const newArr = convertNullToUndefined(arr);
    expect(newArr[0]).toBeUndefined();
    expect(newArr[1].a).toBeUndefined();
    expect(newArr[2][0]).toBeUndefined();
    expect(newArr[2][1]).toBeUndefined();
  });

  it('should not convert other types', () => {
    expect(convertNullToUndefined(undefined)).toBeUndefined();
    expect(convertNullToUndefined(0)).toBe(0);
    expect(convertNullToUndefined('')).toBe('');
    expect(convertNullToUndefined(false)).toBe(false);
    expect(convertNullToUndefined({})).toEqual({});
    expect(convertNullToUndefined([])).toEqual([]);
  });

  it('should convert null in mixed object to undefined', () => {
    const mixedObj = {
      a: null,
      b: {
        c: null,
        d: [null, null],
      },
      e: {
        f: {
          g: null,
          h: {
            i: null,
            j: [null, null],
          },
        },
      },
      k: [null, { l: null }, [null, null]],
    };
    const newMixedObj = convertNullToUndefined(mixedObj);
    expect(newMixedObj.a).toBeUndefined();
    expect(newMixedObj.b.c).toBeUndefined();
    expect(newMixedObj.b.d[0]).toBeUndefined();
    expect(newMixedObj.b.d[1]).toBeUndefined();
    expect(newMixedObj.e.f.g).toBeUndefined();
    expect(newMixedObj.e.f.h.i).toBeUndefined();
    expect(newMixedObj.e.f.h.j[0]).toBeUndefined();
    expect(newMixedObj.e.f.h.j[1]).toBeUndefined();
    expect(newMixedObj.k[0]).toBeUndefined();
    expect(newMixedObj.k[1].l).toBeUndefined();
    expect(newMixedObj.k[2][0]).toBeUndefined();
    expect(newMixedObj.k[2][1]).toBeUndefined();
  });

  it('should convert number to number', () => {
    expect(convertNullToUndefined(1)).toBe(1);
  });

  it('should convert string to string', () => {
    expect(convertNullToUndefined('test')).toBe('test');
  });

  it('should convert undefined to undefined', () => {
    expect(convertNullToUndefined(undefined)).toBeUndefined();
  });

  it('should convert object with number to object with number', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: [3, 4],
      },
    };
    const newObj = convertNullToUndefined(obj);
    expect(newObj.a).toBe(1);
    expect(newObj.b.c).toBe(2);
    expect(newObj.b.d[0]).toBe(3);
    expect(newObj.b.d[1]).toBe(4);
  });

  it('should convert object with string to object with string', () => {
    const obj = {
      a: 'test',
      b: {
        c: 'test2',
        d: ['test3', 'test4'],
      },
    };
    const newObj = convertNullToUndefined(obj);
    expect(newObj.a).toBe('test');
    expect(newObj.b.c).toBe('test2');
    expect(newObj.b.d[0]).toBe('test3');
    expect(newObj.b.d[1]).toBe('test4');
  });

  it('should convert object with undefined to object with undefined', () => {
    const obj = {
      a: undefined,
      b: {
        c: undefined,
        d: [undefined, undefined],
      },
    };
    const newObj = convertNullToUndefined(obj);
    expect(newObj.a).toBeUndefined();
    expect(newObj.b.c).toBeUndefined();
    expect(newObj.b.d[0]).toBeUndefined();
    expect(newObj.b.d[1]).toBeUndefined();
  });

  it('should convert object with null to object with undefined', () => {
    const obj = {
      a: null,
      b: {
        c: null,
        d: [null, null],
      },
    };
    const newObj = convertNullToUndefined(obj);
    expect(newObj.a).toBeUndefined();
    expect(newObj.b.c).toBeUndefined();
    expect(newObj.b.d[0]).toBeUndefined();
    expect(newObj.b.d[1]).toBeUndefined();
  });

  it('should convert object with mixed types to object with mixed types', () => {
    const obj = {
      a: null,
      b: {
        c: 2,
        d: ['test3', null],
      },
      e: {
        f: {
          g: undefined,
          h: {
            i: 1,
            j: [null, 'test4'],
          },
        },
      },
      k: [null, { l: 'test5' }, [undefined, 6]],
    };
    const newObj = convertNullToUndefined(obj);
    expect(newObj.a).toBeUndefined();
    expect(newObj.b.c).toBe(2);
    expect(newObj.b.d[0]).toBe('test3');
    expect(newObj.b.d[1]).toBeUndefined();
    expect(newObj.e.f.g).toBeUndefined();
    expect(newObj.e.f.h.i).toBe(1);
    expect(newObj.e.f.h.j[0]).toBeUndefined();
    expect(newObj.e.f.h.j[1]).toBe('test4');
    expect(newObj.k[0]).toBeUndefined();
    expect(newObj.k[1].l).toBe('test5');
    expect(newObj.k[2][0]).toBeUndefined();
    expect(newObj.k[2][1]).toBe(6);
  });
});
