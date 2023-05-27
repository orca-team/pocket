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

包裹异步接口，并实现 loading，结果，异常等状态管理。

```ts | pure
import { useService } from '@orca-fe/hooks';

const getUserInfo = () => axios.get('/api/user').then((resp) => resp.data);

const getUserInfoService = useService(getUserInfo);
```
