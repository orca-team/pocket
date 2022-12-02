import { CommonStore } from '@orca-fe/pocket';

// 定义计数器的状态
export type CounterStateType = {
  // 计数
  count: number;
};

// 为计数器组件 声明一个 Store （组件外置状态）
export default class CounterStore extends CommonStore<CounterStateType> {
  constructor() {
    // 状态默认值，你也可在构造函中增加参数，由外部传入默认值
    super({
      count: 0,
    });
  }

  // 取值
  getValue() {
    return this.state.count;
  }

  // 编写需要对外暴露的方法
  // +1
  add() {
    const { count } = this.state;

    this.setState({
      count: count + 1,
    });
  }

  // -1
  minus() {
    const { count } = this.state;

    this.setState({
      count: count - 1,
    });
  }
}
