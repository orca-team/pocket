---
title: usePromisifyModal 弹框管理工具
nav:
  title: Hooks
  path: /hooks
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
          // 3. 调用 modal.show 打开弹窗，弹框的书写方式和 antd 的 Modal 一致
          modal.show(<Modal title="弹框标题">弹框内容</Modal>);
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

> 注意：本工具使用函数的方式唤起弹窗，如果你在 show 弹窗的时候，使用到了 state 中的变量，在弹窗打开之后，state 的变化将无法影响到弹窗的渲染。如果你需要实现受状态控制的弹框，请不要使用本工具。

## Demo

<code title="基本使用" src="./usePromisifyModal/basic.tsx" />

<code title="带交互" description="弹窗中包含输入框等需要交互的内容" src="./usePromisifyModal/interactive.tsx" />

<code title="自定义弹窗" description="自定义弹窗指的是，你可以基于`Modal`封装属于自己的弹框组件，将复杂的业务逻辑放在弹框组件内部实现，只要对外仍保留 visible/onOk/onCancel 属性即可。" src="./usePromisifyModal/custom.tsx" />

## API

```ts
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

### Handler 弹框控制句柄

```ts
const modal = usePromisifyModal();
```

#### show 显示

```tsx
modal.show(<Modal title="title">content</Modal>);
```

`modal.show` 返回一个 `Promise` 实例，当弹框点击确认时，`Promise` 的状态将由 `pending` 变为 `resolved`

#### hide 隐藏

使用 `modal.hide()` 即可隐藏弹框。

#### instance 渲染实例

你必须将 `modal.instance` 作为 `render` 渲染的内容，才能够正确渲染弹框。
