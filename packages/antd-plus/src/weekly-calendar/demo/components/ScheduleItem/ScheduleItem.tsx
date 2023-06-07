import { Button, Card, DatePicker, Form, Input, Popover } from 'antd';
import type { Dayjs } from 'dayjs';
import pc from 'prefix-classnames';
import React from 'react';
import './ScheduleItem.less';

const px = pc('schedule-item');

const ef = () => {};

type Range = [Dayjs, Dayjs];

type DataType = {
  title?: string;
  range: Range;
};

export interface ScheduleItemProps extends React.HTMLAttributes<HTMLDivElement> {
  add?: boolean;
  data: DataType;
  onDataChange?: (data: DataType) => void;
  onCancel?: () => void;
}

/**
 * 单个日程
 */
const ScheduleItem = (props: ScheduleItemProps) => {
  const { className = '', data, onDataChange = ef, onCancel = ef, add = false, ...otherProps } = props;
  return (
    <Popover
      trigger={['click']}
      open={add || undefined}
      onOpenChange={(open) => {
        if (add && !open) {
          onCancel();
        }
      }}
      content={(
        <Card title={add ? '创建日程' : '编辑日程'} bordered={false}>
          <Form<DataType>
            initialValues={data}
            onFinish={(value) => {
              onDataChange(value);
            }}
          >
            <Form.Item label="日程名称" name="title" rules={[{ required: true }]}>
              <Input placeholder="请输入日程名称" />
            </Form.Item>
            <Form.Item label="日程范围" name="range" rules={[{ required: true }]}>
              <DatePicker.RangePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm', minuteStep: 15 }} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form>
        </Card>
      )}
    >
      <div className={`${px('root', { 'add-mode': add })} ${className}`} {...otherProps}>
        {data.title}
      </div>
    </Popover>
  );
};

export default ScheduleItem;
