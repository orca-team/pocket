---
title: useService 接口管理
nav:
  title: Hooks
  path: /hooks
group:
  title: hooks
  path: /base
---

# useService 接口管理

`0.10.x`

包裹异步接口，并帮助你对接口 loading，结果，异常 等状态进行管理。

> 在查询请求中，本工具可以起到较大的作用，推荐使用。对于非查询请求（增删改）这类不需要维护结果的请求，可以根据实际情况使用，需要维护 `loading`
> 状态的，还是建议使用本工具，否则直接调接口即可。

```ts | pure
import { useService } from '@orca-fe/hooks';

const getUserInfo = () => axios.get('/api/user').then((resp) => resp.data);

const getUserInfoService = useService(getUserInfo);

// 获取结果
const result = getUserInfoService.data || [];

// 获取loading状态
const loading = getUserInfoService.loading;

// 注意：不推荐直接解构，当你的页面中存在多个接口时，你需要为每一个结构的变量名称起一个不同的名字，非常麻烦。请查看后续示例中的写法

const { data: getUserInfoResult, loading: getUserInfoLoading } = useService(getUserInfo); // 不推荐
```

## 示例

<code src="../demo/useService/Demo1.tsx"></code>
<code src="../demo/useService/Demo2.tsx"></code>
<code src="../demo/useService/Demo3.tsx"></code>

## API

```ts | pure
/**
 * useService 包含了 参数1（接口），参数2（配置），以及返回值（接口的结果和操作）
 * 下面分别展示配置项和返回值的文档类型
 */
function useService(serviceFn: () => Promise<Result>, options: UseServiceOptions): ServiceHandler;
```

### UseServiceOptions 配置项

| 属性              | 说明                                                                      | 类型                                                                                                     | 默认值 | 版本 |
| ----------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------ | ---- |
| manual            | 是否手动发起第一次请求                                                    | `boolean`                                                                                                | false  | `-`  |
| pollingInterval   | 轮询间隔，单位毫秒，如果不传，则不会轮询                                  | `number`                                                                                                 | -      | `-`  |
| pollingWhenHidden | 在页面隐藏时，是否继续轮询                                                | `boolean`                                                                                                | false  | `-`  |
| keepSuccessData   | 如果请求失败(onError)，是否维持之前的结果，默认为 true                    | `boolean`                                                                                                | true   | `-`  |
| initialData       | 默认结果                                                                  | `any`                                                                                                    | -      | `-`  |
| defaultParams     | 初始化时的参数                                                            | `any[]`                                                                                                  | -      | `-`  |
| onSuccess         | 请求成功时的回调事件                                                      | `(data: Result, params: Args) => void`                                                                   | -      | `-`  |
| onFinish          | 請求結束后的回調事件（不論數據處理是否正常）                              | `(data: ServiceResult, params: Args) => void`                                                            | -      | `-`  |
| onError           | 请求失败时的回调事件                                                      | `(error: Error, params: Args) => void`                                                                   | -      | `-`  |
| cacheKey          | 请求缓存的标识                                                            | `string`                                                                                                 | -      | `-`  |
| formatter         | 对结果进行格式化处理（默认会取出 result.data)                             | `(res: ServiceResult) => Result`                                                                         | -      | `-`  |
| stateMgr          | 状态管理器，如果传入，则会使用传入的状态管理器，否则使用内部的 `useState` | `{ state: ServiceState<Args, Result>; setState: Dispatch<SetStateAction<ServiceState<Args, Result>>>; }` | -      | `-`  |

### ServiceHandler 返回值

| 属性    | 说明                             | 类型                                            | 版本 |
| ------- | -------------------------------- | ----------------------------------------------- | ---- |
| run     | 【function】发起新的请求         | `(...args: Args) => Promise<Result\|undefined>` | `-`  |
| data    | 本次请求的结果                   | `any`                                           | `-`  |
| error   | 异常（如果报错）                 | `Error`                                         | `-`  |
| loading | 正在请求状态                     | `boolean`                                       | `-`  |
| params  | 本次请求所使用的参数             | `any[] \| undefined`                            | `-`  |
| refresh | 【function】刷新上一次请求       | `() => Promise<Result \| undefined>`            | `-`  |
| mutate  | 【function】修改接口的结果       | `(result: SetStateAction<Result>) => void`      | `-`  |
| cancel  | 【function】取消本次未完成的请求 | `() => void`                                    | `-`  |
