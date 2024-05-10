/**
 * title: 更新属性
 * description: 使用 instance.update 方法，更新值
 */
import React from 'react';
import { usePromisifyModal } from '@orca-fe/hooks';
import { Button, Modal } from 'antd';

export default () => {
  const modal = usePromisifyModal();

  return (
    <div>
      <Button
        onClick={() => {
          modal.open(
            <Modal title="弹框标题">
              <div>弹框内容</div>
              <Button
                onClick={() => {
                  modal.update({
                    title: `更新标题 ${Math.random()}`,
                  });
                }}
              >
                点我更新标题
              </Button>
            </Modal>,
          );
        }}
      >
        打开弹窗
      </Button>
      {modal.instance}
    </div>
  );
};
