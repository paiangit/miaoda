import { Form, Button, Input } from 'antd';
import useDocumentTitle from '~hooks/useDocumentTitle';
import useLogin from './hooks/useLogin';
import './LoginPage.less';

export default function LoginPage() {
  useDocumentTitle('用户登录');

  const { mutate: login, isLoading } = useLogin();

  const handleFinish = (values) => {
    login(values);
  };

  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  return (
    <div className="auth-sign-in-page">
      <h2 className="title">用户登录</h2>
      <Form form={form} {...layout} onFinish={handleFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input maxLength={14} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password maxLength={14} />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
