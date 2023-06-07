import { Form } from 'antd';
import DialogForm from './DialogForm';

DialogForm['Item'] = Form.Item;

export default DialogForm as typeof DialogForm & {
  Item: typeof Form.Item;
};

export * from './DialogForm';
