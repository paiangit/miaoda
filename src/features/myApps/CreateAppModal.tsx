import { Button, Modal, Form, Input, Radio, message } from 'antd';
import { useState } from 'react';
import { useCreateApp } from './hooks';
// import { AppThemeColor } from './types';
import './CreateAppModal.less';

// interface App {
//   title: string;
//   icon: string;
//   description: string;
//   themeColor: AppThemeColor;
// }
interface CreateAppModalParams {
  onSuccess: () => void;
}

export default function CreateAppModal({ onSuccess }: CreateAppModalParams) {
  const { mutate: createApp } = useCreateApp();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = async () => {
    console.log(form.getFieldsValue());
    try {
      const values = await form.validateFields();
      const userInfo = window.localStorage.getItem(
        process.env.REACT_APP_USER_INFO_KEY
      );
      values.creatorId = JSON.parse(userInfo).id;

      createApp({
        ...values,
        onSuccess,
      });
      setIsModalVisible(false);
    } catch (err) {
      console.log('校验失败', JSON.stringify(err));
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const initialValues = {
    themeColor: 0,
  };

  return (
    <div className="my-apps-create-app-modal">
      <Button className="create-btn" type="primary" onClick={showModal}>
        创建应用
      </Button>
      <Modal
        title="创建应用"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        // 下面两行解决react警告：findDOMNode is deprecated in StrictMode.
        // 见：https://zhuanlan.zhihu.com/p/434372463
        transitionName=""
        maskTransitionName=""
      >
        <Form {...formItemLayout} initialValues={initialValues} form={form}>
          <Form.Item label="应用名称" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="应用图标" name="icon">
            <Input />
          </Form.Item>
          <Form.Item label="应用描述" name="description">
            <Input.TextArea maxLength={100} showCount rows={4} />
          </Form.Item>
          <Form.Item label="应用主题色" name="themeColor">
            <Radio.Group>
              <Radio value={0}>蓝色</Radio>
              <Radio value={1}>橙色</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
