---
title: usePromisifyModal 弹框管理工具

group:
  title: hooks
  path: /base
---

# usePromisifyModal 弹框管理工具

这是一个可以帮你更轻松管理自定义弹窗的 hooks 工具，使用函数的方式开启弹窗。

我们知道，使用`antd`的`Modal`组件时，需要通过其`visible`属性控制弹框的显隐。
如果你的页面中，包含多个弹框组件，就需要分别为他们定义不同的`state`，并监听`onOk`和`onCancel`事件进行状态更新，非常的麻烦。

而事实上，从业务角度来说，打开弹框，就相当于用户的操作区域有原来的较大页面切换到了较小的弹框。
从弹框打开之后到关闭之前，都不会再有和页面状态的联动了。所以这种通过`visible`状态控制显隐的操作，对开发人员是不友好的。

好的弹框交互，应该符合直觉，打开弹框是一个动作，应该用一个函数表示，函数的结果就是本次操作弹框的结果。
比如`antd`提供的`Modal.confirm()`这类函数式调用，就是更加简洁，符合直觉的一种方式。
但`Modal.confirm()`渲染的弹框，脱离了原本的`React`上下文，他会导致弹框无法使用`useContext`获取上下文的内容。
虽然`antd`也提供了`Modal.useModal()`这种方案来解决上下文问题，但还是太局限了。

## 支持异步的弹框设计

考虑到使用弹框时，通常还会伴随异步请求，所以我设计了这样一个符合直觉的弹框 API，用于接管`antd`的`Modal`

### 使用方式

```tsx | pure
import { usePromisifyModal } from '@orca-fe/hooks';

export default () => {
  // 1. 通过 hooks 声明弹框工具
  const modal = usePromisifyModal();

  return (
    <div>
      <Button
        onClick={() => {
          // 3. 调用 modal.open 打开弹窗，弹框的书写方式和 antd 的 Modal 一致
          modal.open(<Modal title="弹框标题">弹框内容</Modal>);
        }}
      >
        打开弹窗
      </Button>
      {/* 2. 【重要】在 render 内部渲染 instance */}
      {modal.instance}
    </div>
  );
};
```

> 注意：本工具使用函数的方式唤起弹窗，如果你在 open 弹窗的时候，使用到了 state 中的变量，在弹窗打开之后，state 的变化将无法影响到弹窗的渲染。如果你需要实现受状态控制的弹框，请不要使用本工具。

## Demo

<code src="../demo/usePromisifyModal/basic.tsx" ></code>

<code src="../demo/usePromisifyModal/interactive.tsx" ></code>

<code src="../demo/usePromisifyModal/custom.tsx" ></code>

<code src="../demo/usePromisifyModal/async.tsx" ></code>

<code src="../demo/usePromisifyModal/async2.tsx" ></code>

<code src="../demo/usePromisifyModal/update.tsx" ></code>

### usePromisifyDrawer

抽屉组件也可以用。但是默认情况下，抽屉组件不带 onOk 确认事件，如果你打算对抽屉组件进行二次封装，并需要 `onOk` 事件，也可以单独设置 `usePromisifyDrawer` 的 `onOkField`

<code title="Drawer" description="我们对侧边抽屉组件 Drawer 也做了类似的封装。" src="../demo/usePromisifyModal/drawer.tsx" ></code>

## API

### usePromisifyModal

```ts | pure
// ts 定义
function usePromisifyModal(options: UsePromisifyModalOptions): Handler;
```

### UsePromisifyModalOptions 弹框属性

| 属性          | 说明                                                                                                                                                        | 类型      | 默认值       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------ |
| visibleField  | 用于控制弹框显隐的属性                                                                                                                                      | `string`  | `'visible'`  |
| onOkField     | 用于监听弹框确认的事件                                                                                                                                      | `string`  | `'onOk'`     |
| onCloseField  | 用于监听弹窗关闭的事件                                                                                                                                      | `string`  | `'onCancel'` |
| destroyDelay  | 卸载延迟（在关闭弹窗时，给定一个延迟，用于弹框播放关闭动画）                                                                                                | `number`  | `500`        |
| rejectOnClose | 当弹窗关闭时，是否抛出异常，默认情况下，弹框关闭时 Promise 不会触发 then 或 catch，永远处于`pending`状态。如需要监听关闭事件，直接在`jsx`中监听组件事件即可 | `boolean` | `false`      |

### usePromisifyDrawer

```ts | pure
// ts 定义
function usePromisifyDrawer(options: UsePromisifyDrawerOptions): Handler;
```

### UsePromisifyDrawerOptions 弹框属性

属性和 `UsePromisifyModalOptions` 相同，只是默认值不同。

| 属性         | 说明                   | 类型     | 默认值      |
| ------------ | ---------------------- | -------- | ----------- |
| onOkField    | 用于监听弹框确认的事件 | `string` | `''`        |
| onCloseField | 用于监听弹窗关闭的事件 | `string` | `'onClose'` |

### Handler 弹框控制句柄

```ts | pure
const modal = usePromisifyModal();
```

#### modal.open 显示

```tsx | pure
modal.open(<Modal title="title">content</Modal>);
```

> modal.show === modal.open

`modal.open` 返回一个 `Promise` 实例，当弹框点击确认时，`Promise` 的状态将由 `pending` 变为 `resolved`

#### modal.ok 模拟 OK 按钮

如有 onOk 事件，会调用。执行完逻辑后，能够完成 Promise。

#### modal.cancel 模拟 Cancel 按钮

如有 onCancel 事件，会调用。执行完逻辑后，根据 rejectOnClose 配置，可能是永久 pending 或 抛出异常。

#### modal.destroy 销毁（关闭）

> modal.destroy === modal.hide

使用 `modal.destroy()` 即可直接关闭弹框。Promise 仍会处于 pending。

#### modal.minimize 最小化

与关闭弹框功能相同，但是不会销毁实例，恢复时可以继续上次的工作。

#### modal.resume 恢复

恢复被最小化的弹窗

使用 `modal.resume()` 即可回复隐藏的弹框。

#### modal.instance 渲染实例

你必须将 `modal.instance` 作为 `render` 渲染的内容，才能够正确渲染弹框。

#### modal.resolve

当 open 了一个弹窗后，调用 modal.resolve();

直接触发 Promise.resolve，推进当前 Promise 结束。

#### modal.update 更新已打开的弹窗属性

```ts
// 更新标题
modal.update({
  title: '新的标题',
});
```

### open 实例的控制句柄

> 不推荐通过 instance 操作 modal，因为所有方法都可以使用 modal.xxx 代替
> open 后获得的 instance 本质是一个 Promise，只是上面挂载了一些方法。

```tsx | pure
const modal = usePromisifyModal();

const instance = modal.open(<Modal>...</Modal>);

// 模拟点击确认按钮 同 modal.ok();
instance.ok();

// 模拟点击取消按钮，会触发 onCancel 事件 同 modal.cancel();
instance.cancel();

// 直接关闭弹窗 同 modal.destroy();
instance.destroy();
// 或 同 modal.hide();
instance.hide();

// 跳过 onOk，直接完成 Promise。注意：该方法不会帮你关闭弹窗，需要自行主动调用 同 modal.resolve();
instance.resolve(value);
```
