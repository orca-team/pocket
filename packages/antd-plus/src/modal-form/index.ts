import { Form } from 'antd';
import ModalForm from './ModalForm';

ModalForm['Item'] = Form.Item;

export default ModalForm as typeof ModalForm & {
  Item: typeof Form.Item;
};

export { ModalForm };

export * from './ModalForm';
