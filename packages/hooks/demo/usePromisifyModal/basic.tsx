import React from 'react';
import { usePromisifyModal } from '@orca-fe/hooks';
import { Button, Modal } from 'antd';

export default () => {
  // 1. 通过 hooks 声明弹框工具
  const modal = usePromisifyModal();

  return (
    <div>
      <Button
        onClick={() => {
          // 3. 调用 modal.show 打开弹窗，弹框的书写方式和 antd 的 Modal 一致
          modal.show(
            <Modal title="弹框标题">
              <div>弹框内容</div>
              <div>
                工具会默认监听 onOk onCancel 事件，自动处理 visible 状态。
              </div>
              <div>
                你也可以使用 close 方法主动关闭弹框，比如：
                <Button
                  onClick={() => {
                    modal.hide();
                  }}
                >
                  主动关闭
                </Button>
              </div>
            </Modal>,
          );
        }}
      >
        打开弹窗
      </Button>
      {/* 2. 【重要】在 render 内部渲染 instance */}
      {modal.instance}
    </div>
  );
};
